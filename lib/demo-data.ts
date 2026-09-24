export interface DemoFinding {
  title: string
  category: 'security' | 'bug' | 'performance' | 'maintainability' | 'style'
  severity: 'critical' | 'high' | 'medium' | 'low'
  certainty: 'certain' | 'likely' | 'suggestion'
  confidence: number
  file: string
  lineStart: number
  lineEnd: number
  evidence: string
  explanation: string
  impact: string
  suggestedFix: string
  fixPatch: string
  testCase: string
  blastRadius?: any
}

export interface DemoPR {
  id: string
  number: number
  title: string
  repository: string
  diff: string
  findings: DemoFinding[]
}

export const DEMO_PRS: DemoPR[] = [
  {
    id: 'demo-1',
    number: 142,
    title: 'Add user search endpoint',
    repository: 'payment-service',
    diff: `diff --git a/api/users.js b/api/users.js
index 1234567..89abcdef 100644
--- a/api/users.js
+++ b/api/users.js
@@ -39,6 +39,15 @@ router.get('/users/:id', async (req, res) => {
   }
 });
 
+// New search endpoint
+router.get('/users/search', async (req, res) => {
+  const { query } = req.query;
+  const sql = "SELECT * FROM users WHERE name LIKE '%" + query + "%'";
+  const results = await db.query(sql);
+  res.json(results);
+});
+
 router.post('/users', async (req, res) => {
   try {
     const { name, email } = req.body;`,
    findings: [
      {
        title: 'SQL Injection Vulnerability',
        category: 'security',
        severity: 'critical',
        certainty: 'certain',
        confidence: 0.98,
        file: 'api/users.js',
        lineStart: 45,
        lineEnd: 45,
        evidence: 'User-controlled input `query` is directly concatenated into SQL query string without sanitization or parameterization.',
        explanation: 'The search endpoint concatenates user input directly into a SQL query string. An attacker could manipulate the `query` parameter to inject malicious SQL code, potentially accessing, modifying, or deleting unauthorized database records.',
        impact: 'An attacker could:\n- Extract sensitive user data including passwords and personal information\n- Modify or delete database records\n- Bypass authentication\n- Execute administrative operations\n\nExample attack: `?query=\' OR \'1\'=\'1\' --` would return all users.',
        suggestedFix: 'Use parameterized queries to prevent SQL injection:\n\n```javascript\nconst sql = "SELECT * FROM users WHERE name LIKE $1";\nconst results = await db.query(sql, [`%${query}%`]);\n```',
        fixPatch: `@@ -43,7 +43,7 @@
 router.get('/users/search', async (req, res) => {
   const { query } = req.query;
-  const sql = "SELECT * FROM users WHERE name LIKE '%" + query + "%'";
-  const results = await db.query(sql);
+  const sql = "SELECT * FROM users WHERE name LIKE $1";
+  const results = await db.query(sql, [\`%\${query}%\`]);
   res.json(results);
 });`,
        testCase: `test('prevents SQL injection in user search', async () => {
  const maliciousQuery = "' OR '1'='1' --";
  const response = await request(app)
    .get(\`/users/search?query=\${encodeURIComponent(maliciousQuery)}\`)
    .expect(200);
  
  // Should return 0 results or safe error, not all users
  expect(response.body.length).toBeLessThan(10);
  expect(response.body).not.toContain(expect.objectContaining({
    email: 'admin@example.com'
  }));
});`,
        blastRadius: {
          nodes: [
            { id: 'user', label: 'User Input', level: 0, type: 'source' },
            { id: 'api', label: 'API Endpoint', level: 1, type: 'affected' },
            { id: 'db', label: 'Database', level: 2, type: 'critical' },
            { id: 'payment', label: 'Payment Service', level: 3, type: 'downstream' },
          ],
          edges: [
            { from: 'user', to: 'api' },
            { from: 'api', to: 'db' },
            { from: 'db', to: 'payment' },
          ]
        }
      }
    ]
  },
  {
    id: 'demo-2',
    number: 156,
    title: 'Add Stripe integration',
    repository: 'payment-service',
    diff: `diff --git a/config/payment.js b/config/payment.js
index 2345678..9abcdef0 100644
--- a/config/payment.js
+++ b/config/payment.js
@@ -1,8 +1,12 @@
 const stripe = require('stripe');
 
+// Stripe configuration
+const stripeApiKey = 'sk_test_51HqJ4xYqGP0KxYqGP0KxYqGP0KxYqGP0KxYqGP';
+
 module.exports = {
-  stripeClient: stripe(process.env.STRIPE_API_KEY),
+  stripeClient: stripe(stripeApiKey),
   currency: 'usd',
+  webhookSecret: 'whsec_test_secret_123456789',
 };`,
    findings: [
      {
        title: 'Hardcoded API Secret Key',
        category: 'security',
        severity: 'critical',
        certainty: 'certain',
        confidence: 0.99,
        file: 'config/payment.js',
        lineStart: 4,
        lineEnd: 4,
        evidence: 'Stripe API secret key `sk_test_51...` is hardcoded directly in source code.',
        explanation: 'The Stripe API secret key is hardcoded in the source file and will be committed to version control. Anyone with repository access can see this key and use it to make unauthorized payment operations.',
        impact: 'An attacker with access to this key could:\n- Process unauthorized payments\n- Refund transactions\n- Access customer payment information\n- Modify payment configurations\n- Potentially cause financial loss\n\nIf this code is deployed, the key becomes publicly accessible in production.',
        suggestedFix: 'Store API keys in environment variables and never commit them:\n\n```javascript\nconst stripeApiKey = process.env.STRIPE_API_KEY;\n\nif (!stripeApiKey) {\n  throw new Error(\'STRIPE_API_KEY environment variable is required\');\n}\n```\n\nAdd to .env:\n```\nSTRIPE_API_KEY=sk_test_...\n```\n\nAdd .env to .gitignore.',
        fixPatch: `@@ -1,8 +1,12 @@
 const stripe = require('stripe');
 
-const stripeApiKey = 'sk_test_51HqJ4xYqGP0KxYqGP0KxYqGP0KxYqGP0KxYqGP';
+const stripeApiKey = process.env.STRIPE_API_KEY;
+
+if (!stripeApiKey) {
+  throw new Error('STRIPE_API_KEY environment variable is required');
+}
 
 module.exports = {
   stripeClient: stripe(stripeApiKey),
   currency: 'usd',
-  webhookSecret: 'whsec_test_secret_123456789',
+  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
 };`,
        testCase: `test('throws error when STRIPE_API_KEY is missing', () => {
  delete process.env.STRIPE_API_KEY;
  
  expect(() => {
    require('./config/payment');
  }).toThrow('STRIPE_API_KEY environment variable is required');
});

test('does not expose API keys in config', () => {
  const config = require('./config/payment');
  const configString = JSON.stringify(config);
  
  expect(configString).not.toMatch(/sk_test_/);
  expect(configString).not.toMatch(/whsec_test_/);
});`,
        blastRadius: {
          nodes: [
            { id: 'code', label: 'Source Code', level: 0, type: 'source' },
            { id: 'vcs', label: 'Git Repository', level: 1, type: 'affected' },
            { id: 'stripe', label: 'Stripe API', level: 2, type: 'critical' },
            { id: 'payments', label: 'Payment Processing', level: 3, type: 'critical' },
            { id: 'customer', label: 'Customer Data', level: 3, type: 'critical' },
          ],
          edges: [
            { from: 'code', to: 'vcs' },
            { from: 'vcs', to: 'stripe' },
            { from: 'stripe', to: 'payments' },
            { from: 'stripe', to: 'customer' },
          ]
        }
      },
      {
        title: 'Hardcoded Webhook Secret',
        category: 'security',
        severity: 'high',
        certainty: 'certain',
        confidence: 0.97,
        file: 'config/payment.js',
        lineStart: 9,
        lineEnd: 9,
        evidence: 'Stripe webhook secret `whsec_test_secret_123456789` is hardcoded.',
        explanation: 'The webhook secret is hardcoded, allowing attackers to forge webhook events.',
        impact: 'Attackers could send fake payment confirmation webhooks, potentially causing:\n- Fraudulent order fulfillment\n- Incorrect payment status updates\n- Business logic bypass',
        suggestedFix: 'Move webhook secret to environment variable:\n```javascript\nwebhookSecret: process.env.STRIPE_WEBHOOK_SECRET\n```',
        fixPatch: '',
        testCase: `test('validates webhook signature', async () => {
  const fakeEvent = { type: 'payment_intent.succeeded' };
  const response = await request(app)
    .post('/webhooks/stripe')
    .send(fakeEvent)
    .expect(400);
  
  expect(response.body.error).toContain('Invalid signature');
});`
      }
    ]
  },
  {
    id: 'demo-3',
    number: 178,
    title: 'Optimize product listing page',
    repository: 'ecommerce-frontend',
    diff: `diff --git a/pages/products.tsx b/pages/products.tsx
index 3456789..abcdef01 100644
--- a/pages/products.tsx
+++ b/pages/products.tsx
@@ -12,12 +12,20 @@ export default function ProductsPage() {
   useEffect(() => {
     async function fetchProducts() {
       const response = await fetch('/api/products');
       const data = await response.json();
-      setProducts(data);
+      
+      // Enrich products with category details
+      const enriched = [];
+      for (const product of data) {
+        const category = await fetch(\`/api/categories/\${product.categoryId}\`);
+        const categoryData = await category.json();
+        enriched.push({ ...product, category: categoryData });
+      }
+      
+      setProducts(enriched);
     }
     
     fetchProducts();
   }, []);`,
    findings: [
      {
        title: 'N+1 Query Problem in API Calls',
        category: 'performance',
        severity: 'high',
        certainty: 'certain',
        confidence: 0.95,
        file: 'pages/products.tsx',
        lineStart: 19,
        lineEnd: 22,
        evidence: 'Loop makes individual API calls for each product\'s category. If 100 products exist, this creates 101 requests (1 + 100).',
        explanation: 'This code fetches products first, then makes a separate API call for each product to get its category. This is a classic N+1 performance problem. With 100 products, the page makes 101 HTTP requests instead of 1 or 2.',
        impact: 'Performance degradation:\n- Page load time increases linearly with product count\n- 100 products = ~5-10 seconds of loading\n- Increased server load\n- Poor user experience\n- Higher bandwidth costs\n- Potential API rate limit issues',
        suggestedFix: 'Fetch categories with products in a single query, or use a batch endpoint:\n\n```typescript\n// Option 1: Backend includes categories\nconst response = await fetch(\'/api/products?include=category\');\nconst data = await response.json();\nsetProducts(data);\n\n// Option 2: Batch fetch categories\nconst productResponse = await fetch(\'/api/products\');\nconst products = await productResponse.json();\n\nconst categoryIds = [...new Set(products.map(p => p.categoryId))];\nconst categoriesResponse = await fetch(\n  \`/api/categories?ids=\${categoryIds.join(\',\')}\`\n);\nconst categories = await categoriesResponse.json();\n\nconst enriched = products.map(product => ({\n  ...product,\n  category: categories.find(c => c.id === product.categoryId)\n}));\nsetProducts(enriched);\n```',
        fixPatch: `@@ -14,12 +14,15 @@
     async function fetchProducts() {
       const response = await fetch('/api/products');
       const data = await response.json();
       
-      // Enrich products with category details
-      const enriched = [];
-      for (const product of data) {
-        const category = await fetch(\`/api/categories/\${product.categoryId}\`);
-        const categoryData = await category.json();
-        enriched.push({ ...product, category: categoryData });
-      }
+      // Batch fetch categories
+      const categoryIds = [...new Set(data.map(p => p.categoryId))];
+      const categoriesResponse = await fetch(
+        \`/api/categories?ids=\${categoryIds.join(',')}\`
+      );
+      const categories = await categoriesResponse.json();
+      
+      const enriched = data.map(product => ({
+        ...product,
+        category: categories.find(c => c.id === product.categoryId)
+      }));
       
       setProducts(enriched);
     }`,
        testCase: `test('fetches products with categories efficiently', async () => {
  const fetchSpy = jest.spyOn(global, 'fetch');
  
  render(<ProductsPage />);
  
  await waitFor(() => {
    expect(screen.getByText('Products')).toBeInTheDocument();
  });
  
  // Should make only 2 requests: 1 for products, 1 for categories
  expect(fetchSpy).toHaveBeenCalledTimes(2);
  expect(fetchSpy).toHaveBeenCalledWith('/api/products');
  expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/api/categories?ids='));
});`,
        blastRadius: {
          nodes: [
            { id: 'page', label: 'Products Page', level: 0, type: 'source' },
            { id: 'api', label: 'API Server', level: 1, type: 'affected' },
            { id: 'db', label: 'Database', level: 2, type: 'affected' },
            { id: 'user', label: 'User Experience', level: 1, type: 'affected' },
          ],
          edges: [
            { from: 'page', to: 'api' },
            { from: 'api', to: 'db' },
            { from: 'page', to: 'user' },
          ]
        }
      }
    ]
  },
  {
    id: 'demo-4',
    number: 203,
    title: 'Add account deletion feature',
    repository: 'user-service',
    diff: `diff --git a/services/account.js b/services/account.js
index 4567890..bcdef012 100644
--- a/services/account.js
+++ b/services/account.js
@@ -45,6 +45,19 @@ async function updateAccount(userId, data) {
   return account;
 }
 
+async function deleteAccount(userId) {
+  const account = await db.accounts.findOne({ userId });
+  
+  // Delete user data
+  await db.accounts.delete({ userId });
+  await db.profiles.delete({ userId });
+  await db.sessions.delete({ userId });
+  
+  console.log(\`Account \${account.email} deleted\`);
+  
+  return { success: true };
+}
+
 module.exports = {
   getAccount,
   updateAccount,`,
    findings: [
      {
        title: 'Unhandled Null Reference Error',
        category: 'bug',
        severity: 'high',
        certainty: 'certain',
        confidence: 0.92,
        file: 'services/account.js',
        lineStart: 49,
        lineEnd: 49,
        evidence: 'Variable `account` is used at line 56 without checking if it is null. If `findOne` returns null, `account.email` will throw TypeError.',
        explanation: 'The code assumes `db.accounts.findOne()` will always return an account object, but it returns null when no account is found. Accessing `account.email` when account is null causes a runtime error that crashes the request.',
        impact: 'Application crashes when:\n- Non-existent userId is provided\n- Account was already deleted\n- Database query fails\n\nThis creates:\n- 500 Internal Server Error responses\n- Poor user experience\n- Incomplete deletion (sessions/profiles may not be deleted)\n- No proper error message to client',
        suggestedFix: 'Add null check and proper error handling:\n\n```javascript\nasync function deleteAccount(userId) {\n  const account = await db.accounts.findOne({ userId });\n  \n  if (!account) {\n    throw new Error(\`Account not found for user \${userId}\`);\n  }\n  \n  try {\n    // Delete user data\n    await db.accounts.delete({ userId });\n    await db.profiles.delete({ userId });\n    await db.sessions.delete({ userId });\n    \n    console.log(\`Account \${account.email} deleted\`);\n    \n    return { success: true, email: account.email };\n  } catch (error) {\n    console.error(\`Failed to delete account \${userId}:\`, error);\n    throw new Error(\'Account deletion failed\');\n  }\n}\n```',
        fixPatch: `@@ -48,6 +48,10 @@
 async function deleteAccount(userId) {
   const account = await db.accounts.findOne({ userId });
   
+  if (!account) {
+    throw new Error(\`Account not found for user \${userId}\`);
+  }
+  
+  try {
     // Delete user data
     await db.accounts.delete({ userId });
     await db.profiles.delete({ userId });
     await db.sessions.delete({ userId });
     
     console.log(\`Account \${account.email} deleted\`);
     
-    return { success: true };
+    return { success: true, email: account.email };
+  } catch (error) {
+    console.error(\`Failed to delete account \${userId}:\`, error);
+    throw new Error('Account deletion failed');
+  }
 }`,
        testCase: `test('handles missing account gracefully', async () => {
  await expect(
    deleteAccount('non-existent-user-id')
  ).rejects.toThrow('Account not found');
});

test('handles database errors during deletion', async () => {
  jest.spyOn(db.accounts, 'delete').mockRejectedValue(
    new Error('Database connection lost')
  );
  
  await expect(
    deleteAccount('valid-user-id')
  ).rejects.toThrow('Account deletion failed');
});

test('successfully deletes account when it exists', async () => {
  const result = await deleteAccount('existing-user-id');
  
  expect(result.success).toBe(true);
  expect(result.email).toBe('user@example.com');
});`,
        blastRadius: {
          nodes: [
            { id: 'api', label: 'Delete API', level: 0, type: 'source' },
            { id: 'service', label: 'Account Service', level: 1, type: 'affected' },
            { id: 'db', label: 'Database', level: 2, type: 'affected' },
            { id: 'error', label: 'Error Handler', level: 1, type: 'affected' },
          ],
          edges: [
            { from: 'api', to: 'service' },
            { from: 'service', to: 'db' },
            { from: 'service', to: 'error' },
          ]
        }
      },
      {
        title: 'Missing Transaction for Multi-Step Operation',
        category: 'bug',
        severity: 'medium',
        certainty: 'likely',
        confidence: 0.85,
        file: 'services/account.js',
        lineStart: 51,
        lineEnd: 53,
        evidence: 'Three separate delete operations without transaction. If one fails, data is left in inconsistent state.',
        explanation: 'Account deletion involves three database operations. If the second or third operation fails, the account is partially deleted, leaving orphaned data.',
        impact: 'Data inconsistency:\n- Orphaned profile data\n- Active sessions for deleted accounts\n- Incomplete GDPR compliance',
        suggestedFix: 'Wrap deletions in a database transaction:\n```javascript\nawait db.transaction(async (trx) => {\n  await trx.accounts.delete({ userId });\n  await trx.profiles.delete({ userId });\n  await trx.sessions.delete({ userId });\n});\n```',
        fixPatch: '',
        testCase: `test('rolls back deletion if any step fails', async () => {
  jest.spyOn(db.profiles, 'delete').mockRejectedValue(new Error('DB error'));
  
  await expect(deleteAccount('user-id')).rejects.toThrow();
  
  // Account should still exist
  const account = await db.accounts.findOne({ userId: 'user-id' });
  expect(account).not.toBeNull();
});`
      }
    ]
  },
  {
    id: 'demo-5',
    number: 215,
    title: 'Refactor authentication middleware',
    repository: 'api-gateway',
    diff: `diff --git a/middleware/auth.js b/middleware/auth.js
index 5678901..cdef0123 100644
--- a/middleware/auth.js
+++ b/middleware/auth.js
@@ -8,22 +8,38 @@ const jwt = require('jsonwebtoken');
 async function authenticate(req, res, next) {
   const token = req.headers.authorization?.split(' ')[1];
   
   if (!token) {
-    return res.status(401).json({ error: 'No token provided' });
+    return res.status(401).json({ error: 'Unauthorized' });
   }
   
-  const decoded = jwt.verify(token, process.env.JWT_SECRET);
-  req.user = decoded;
-  next();
+  try {
+    const decoded = jwt.verify(token, 'my-super-secret-key-12345');
+    req.user = decoded;
+    
+    // Log authentication for debugging
+    await logAuthentication(req.user.id, req.ip);
+    
+    next();
+  } catch (error) {
+    res.status(401).json({ error: 'Invalid token' });
+  }
 }
 
+async function logAuthentication(userId, ip) {
+  const query = "INSERT INTO auth_logs (user_id, ip_address, timestamp) VALUES ('" + 
+                userId + "', '" + ip + "', NOW())";
+  await db.query(query);
+}
+
 module.exports = { authenticate };`,
    findings: [
      {
        title: 'Hardcoded JWT Secret Key',
        category: 'security',
        severity: 'critical',
        certainty: 'certain',
        confidence: 0.99,
        file: 'middleware/auth.js',
        lineStart: 16,
        lineEnd: 16,
        evidence: 'JWT secret key \'my-super-secret-key-12345\' is hardcoded instead of using environment variable.',
        explanation: 'The JWT secret is hardcoded and weak. Anyone with code access can forge authentication tokens and impersonate any user.',
        impact: 'Complete authentication bypass:\n- Attackers can create valid tokens for any user\n- Admin access compromise\n- User impersonation\n- Data breach',
        suggestedFix: 'Use environment variable and strong secret:\n```javascript\nconst decoded = jwt.verify(token, process.env.JWT_SECRET);\n```\nGenerate strong secret: `openssl rand -base64 32`',
        fixPatch: `@@ -14,7 +14,7 @@
   }
   
   try {
-    const decoded = jwt.verify(token, 'my-super-secret-key-12345');
+    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.user = decoded;`,
        testCase: `test('uses environment variable for JWT secret', () => {
  const originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'test-secret';
  
  const token = jwt.sign({ id: 'user123' }, 'test-secret');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  expect(decoded.id).toBe('user123');
  process.env.JWT_SECRET = originalSecret;
});`,
        blastRadius: {
          nodes: [
            { id: 'code', label: 'Auth Code', level: 0, type: 'source' },
            { id: 'jwt', label: 'JWT System', level: 1, type: 'critical' },
            { id: 'api', label: 'All APIs', level: 2, type: 'critical' },
            { id: 'data', label: 'User Data', level: 3, type: 'critical' },
          ],
          edges: [
            { from: 'code', to: 'jwt' },
            { from: 'jwt', to: 'api' },
            { from: 'api', to: 'data' },
          ]
        }
      },
      {
        title: 'SQL Injection in Authentication Logging',
        category: 'security',
        severity: 'high',
        certainty: 'certain',
        confidence: 0.96,
        file: 'middleware/auth.js',
        lineStart: 29,
        lineEnd: 31,
        evidence: 'User ID and IP address concatenated directly into SQL query without parameterization.',
        explanation: 'The logging function builds SQL with string concatenation. Attacker-controlled userId or IP could inject SQL.',
        impact: 'SQL injection through authentication logs:\n- Database compromise\n- Data extraction\n- Log manipulation',
        suggestedFix: 'Use parameterized query:\n```javascript\nconst query = "INSERT INTO auth_logs (user_id, ip_address, timestamp) VALUES ($1, $2, NOW())";\nawait db.query(query, [userId, ip]);\n```',
        fixPatch: '',
        testCase: `test('prevents SQL injection in auth logging', async () => {
  const maliciousId = "1'); DROP TABLE auth_logs; --";
  await logAuthentication(maliciousId, '192.168.1.1');
  
  // Table should still exist
  const result = await db.query('SELECT COUNT(*) FROM auth_logs');
  expect(result).toBeDefined();
});`
      },
      {
        title: 'Blocking I/O in Authentication Middleware',
        category: 'performance',
        severity: 'medium',
        certainty: 'likely',
        confidence: 0.88,
        file: 'middleware/auth.js',
        lineStart: 19,
        lineEnd: 19,
        evidence: 'Awaiting database logging operation in critical authentication path. This blocks every request.',
        explanation: 'Authentication middleware waits for log insertion to complete before continuing. This adds latency to every authenticated request.',
        impact: 'Performance degradation:\n- 50-200ms added to every request\n- Reduced throughput\n- Poor user experience\n- Database becomes bottleneck',
        suggestedFix: 'Log asynchronously without blocking:\n```javascript\nlogAuthentication(req.user.id, req.ip).catch(err => \n  console.error(\'Failed to log auth:\', err)\n);\nnext();\n```',
        fixPatch: '',
        testCase: `test('authentication does not block on logging', async () => {
  const start = Date.now();
  await authenticate(mockReq, mockRes, mockNext);
  const duration = Date.now() - start;
  
  // Should complete quickly without waiting for DB
  expect(duration).toBeLessThan(50);
});`
      },
      {
        title: 'Inconsistent Error Messages',
        category: 'security',
        severity: 'low',
        certainty: 'suggestion',
        confidence: 0.75,
        file: 'middleware/auth.js',
        lineStart: 11,
        lineEnd: 23,
        evidence: 'Different error messages for missing vs invalid tokens could help attackers.',
        explanation: 'Returning different errors for "No token" vs "Invalid token" could help attackers determine if tokens exist.',
        impact: 'Minor information disclosure:\n- Attackers can distinguish missing vs invalid tokens\n- Helps in enumeration attacks',
        suggestedFix: 'Use consistent error message:\n```javascript\nreturn res.status(401).json({ error: \'Authentication failed\' });\n```',
        fixPatch: '',
        testCase: ''
      },
      {
        title: 'Large Authentication Function',
        category: 'maintainability',
        severity: 'low',
        certainty: 'suggestion',
        confidence: 0.70,
        file: 'middleware/auth.js',
        lineStart: 8,
        lineEnd: 26,
        evidence: 'Authentication function handles token extraction, verification, logging, and error handling. Consider splitting concerns.',
        explanation: 'The function mixes multiple responsibilities. Extracting concerns would improve testability and maintainability.',
        impact: 'Code maintainability:\n- Harder to test individual pieces\n- Mixing concerns\n- Reduced reusability',
        suggestedFix: 'Extract token extraction and logging:\n```javascript\nfunction extractToken(req) { ... }\nasync function verifyToken(token) { ... }\nasync function logAuth(userId, ip) { ... }\n```',
        fixPatch: '',
        testCase: ''
      }
    ]
  }
];

export function getDemoPR(id: string): DemoPR | undefined {
  return DEMO_PRS.find(pr => pr.id === id);
}

export function getAllDemoPRs(): DemoPR[] {
  return DEMO_PRS;
}
