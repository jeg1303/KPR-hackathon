import { AIFinding } from './ai-analysis';

export interface GeneratedTest {
  code: string;
  language: string;
  framework: string;
  reason: string;
}

export function generateTestForFinding(finding: AIFinding): GeneratedTest {
  // If finding already has a test case, use it
  if (finding.testCase) {
    return {
      code: finding.testCase,
      language: detectLanguage(finding.file),
      framework: detectFramework(finding.file),
      reason: `Verifies the ${finding.title.toLowerCase()} is fixed and prevents regression.`,
    };
  }
  
  // Otherwise generate a basic test template
  const language = detectLanguage(finding.file);
  const framework = detectFramework(finding.file);
  
  const testCode = generateTestCode(finding, language, framework);
  
  return {
    code: testCode,
    language,
    framework,
    reason: `Tests the exact failure condition detected by ReleaseGuard: ${finding.title}`,
  };
}

function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (ext === 'js' || ext === 'jsx') return 'javascript';
  if (ext === 'ts' || ext === 'tsx') return 'typescript';
  if (ext === 'py') return 'python';
  if (ext === 'java') return 'java';
  if (ext === 'go') return 'go';
  if (ext === 'rb') return 'ruby';
  
  return 'javascript';
}

function detectFramework(filename: string): string {
  const language = detectLanguage(filename);
  
  if (language === 'javascript' || language === 'typescript') {
    return 'jest';
  }
  if (language === 'python') {
    return 'pytest';
  }
  if (language === 'java') {
    return 'junit';
  }
  if (language === 'go') {
    return 'testing';
  }
  if (language === 'ruby') {
    return 'rspec';
  }
  
  return 'jest';
}

function generateTestCode(
  finding: AIFinding,
  language: string,
  framework: string
): string {
  if (language === 'javascript' || language === 'typescript') {
    return generateJavaScriptTest(finding, framework);
  }
  if (language === 'python') {
    return generatePythonTest(finding);
  }
  
  return generateJavaScriptTest(finding, framework);
}

function generateJavaScriptTest(finding: AIFinding, framework: string): string {
  const testName = finding.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  
  if (finding.category === 'security') {
    if (finding.title.toLowerCase().includes('sql injection')) {
      return `test('prevents SQL injection in ${finding.file}', async () => {
  // Test with malicious input
  const maliciousInput = "' OR '1'='1' --";
  
  // This should NOT return unauthorized data
  const result = await queryFunction(maliciousInput);
  
  expect(result).toBeDefined();
  expect(result.length).toBeLessThan(5); // Should not return all records
  
  // Verify parameterized query is used
  expect(mockDb.query).toHaveBeenCalledWith(
    expect.stringContaining('$1'),
    expect.arrayContaining([expect.any(String)])
  );
});`;
    }
    
    if (finding.title.toLowerCase().includes('hardcoded')) {
      return `test('does not expose hardcoded secrets', () => {
  // Verify environment variable is used
  expect(process.env.API_KEY).toBeDefined();
  
  // Verify code doesn't contain hardcoded secret patterns
  const sourceCode = require('fs').readFileSync('${finding.file}', 'utf8');
  expect(sourceCode).not.toMatch(/sk_live_[a-zA-Z0-9]{24,}/);
  expect(sourceCode).not.toMatch(/sk_test_[a-zA-Z0-9]{24,}/);
});`;
    }
    
    if (finding.title.toLowerCase().includes('xss')) {
      return `test('sanitizes user input to prevent XSS', () => {
  const maliciousInput = '<script>alert("XSS")</script>';
  
  const result = renderFunction(maliciousInput);
  
  // Should escape HTML entities
  expect(result).not.toContain('<script>');
  expect(result).toContain('&lt;script&gt;');
});`;
    }
  }
  
  if (finding.category === 'bug') {
    if (finding.title.toLowerCase().includes('null')) {
      return `test('handles null/undefined safely in ${finding.file}', async () => {
  // Test with missing/null data
  const result = await functionUnderTest(null);
  
  // Should not throw error
  expect(result).toBeDefined();
  
  // Or should throw appropriate error
  // await expect(functionUnderTest(null)).rejects.toThrow('Expected error message');
});`;
    }
    
    if (finding.title.toLowerCase().includes('error')) {
      return `test('handles errors gracefully', async () => {
  // Mock failure condition
  mockDependency.mockRejectedValue(new Error('Simulated failure'));
  
  await expect(async () => {
    await functionUnderTest();
  }).rejects.toThrow();
  
  // Verify error is logged
  expect(console.error).toHaveBeenCalled();
});`;
    }
  }
  
  if (finding.category === 'performance') {
    if (finding.title.toLowerCase().includes('n+1')) {
      return `test('avoids N+1 query problem', async () => {
  const spy = jest.spyOn(database, 'query');
  
  await functionUnderTest();
  
  // Should make 2 queries max (1 for main data, 1 for batch)
  // NOT N+1 queries
  expect(spy).toHaveBeenCalledTimes(2);
});`;
    }
  }
  
  // Generic test template
  return `test('${testName}', async () => {
  // Arrange: Set up test data
  const testInput = {}; // TODO: Add appropriate test data
  
  // Act: Execute the function
  const result = await functionUnderTest(testInput);
  
  // Assert: Verify the behavior
  expect(result).toBeDefined();
  
  // TODO: Add specific assertions for ${finding.title}
});`;
}

function generatePythonTest(finding: AIFinding): string {
  const testName = finding.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').trim();
  
  if (finding.category === 'security') {
    if (finding.title.toLowerCase().includes('sql injection')) {
      return `def test_prevents_sql_injection():
    """Test that SQL injection is prevented in ${finding.file}"""
    # Test with malicious input
    malicious_input = "' OR '1'='1' --"
    
    # This should NOT return unauthorized data
    result = query_function(malicious_input)
    
    assert result is not None
    assert len(result) < 5  # Should not return all records
    
    # Verify parameterized query is used
    assert mock_db.execute.called_with(
        contains("?"),
        (malicious_input,)
    )`;
    }
  }
  
  if (finding.category === 'bug') {
    if (finding.title.toLowerCase().includes('null')) {
      return `def test_handles_none_safely():
    """Test that None values are handled safely"""
    # Test with None
    result = function_under_test(None)
    
    # Should not raise error
    assert result is not None
    
    # Or should raise appropriate error
    # with pytest.raises(ValueError, match="Expected error"):
    #     function_under_test(None)`;
    }
  }
  
  return `def test_${testName}():
    """Test for ${finding.title}"""
    # Arrange: Set up test data
    test_input = {}  # TODO: Add appropriate test data
    
    # Act: Execute the function
    result = function_under_test(test_input)
    
    # Assert: Verify the behavior
    assert result is not None
    
    # TODO: Add specific assertions for ${finding.title}`;
}

export function generateTestSuite(findings: AIFinding[]): string {
  const language = findings.length > 0 ? detectLanguage(findings[0].file) : 'javascript';
  const framework = findings.length > 0 ? detectFramework(findings[0].file) : 'jest';
  
  let suite = '';
  
  if (language === 'javascript' || language === 'typescript') {
    suite += `// Generated test suite for security and reliability\n\n`;
    
    for (const finding of findings) {
      if (finding.category === 'security' || finding.category === 'bug') {
        const test = generateTestForFinding(finding);
        suite += test.code + '\n\n';
      }
    }
  }
  
  return suite;
}
