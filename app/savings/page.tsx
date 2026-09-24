'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Zap,
  Users,
  Calculator,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export default function SavingsCalculatorPage() {
  // Input states
  const [teamSize, setTeamSize] = useState(5);
  const [avgHourlyRate, setAvgHourlyRate] = useState(75);
  const [reviewsPerMonth, setReviewsPerMonth] = useState(20);
  const [manualReviewHours, setManualReviewHours] = useState(4);
  const [bugsPreventedPerMonth, setBugsPreventedPerMonth] = useState(8);
  const [avgBugFixHours, setAvgBugFixHours] = useState(6);
  const [incidentsPreventedPerYear, setIncidentsPreventedPerYear] = useState(2);
  const [avgIncidentCost, setAvgIncidentCost] = useState(50000);

  // Calculations
  const calculateSavings = () => {
    // Time savings from automated reviews
    const automatedReviewHours = 0.5; // ReleaseGuard takes ~30 min vs 4 hours manual
    const timeSavedPerReview = manualReviewHours - automatedReviewHours;
    const monthlyTimeSavings = timeSavedPerReview * reviewsPerMonth;
    const annualTimeSavings = monthlyTimeSavings * 12;
    const annualTimeSavingsCost = annualTimeSavings * avgHourlyRate;

    // Cost savings from prevented bugs
    const monthlyBugFixCost = bugsPreventedPerMonth * avgBugFixHours * avgHourlyRate;
    const annualBugFixSavings = monthlyBugFixCost * 12;

    // Incident prevention savings
    const annualIncidentSavings = incidentsPreventedPerYear * avgIncidentCost;

    // Total savings
    const totalAnnualSavings = annualTimeSavingsCost + annualBugFixSavings + annualIncidentSavings;

    // ReleaseGuard cost (estimate)
    const releaseGuardMonthlyCost = 199 * teamSize; // $199 per developer per month
    const releaseGuardAnnualCost = releaseGuardMonthlyCost * 12;

    // ROI
    const netSavings = totalAnnualSavings - releaseGuardAnnualCost;
    const roi = ((netSavings / releaseGuardAnnualCost) * 100);
    const paybackMonths = releaseGuardAnnualCost / (totalAnnualSavings / 12);

    return {
      // Time savings
      monthlyTimeSavings: Math.round(monthlyTimeSavings),
      annualTimeSavings: Math.round(annualTimeSavings),
      annualTimeSavingsCost: Math.round(annualTimeSavingsCost),

      // Bug prevention
      monthlyBugFixCost: Math.round(monthlyBugFixCost),
      annualBugFixSavings: Math.round(annualBugFixSavings),

      // Incident prevention
      annualIncidentSavings: Math.round(annualIncidentSavings),

      // Totals
      totalAnnualSavings: Math.round(totalAnnualSavings),
      releaseGuardAnnualCost: Math.round(releaseGuardAnnualCost),
      netSavings: Math.round(netSavings),
      roi: Math.round(roi),
      paybackMonths: Math.max(0.1, paybackMonths).toFixed(1),

      // Additional metrics
      savingsPerDeveloper: Math.round(totalAnnualSavings / teamSize),
      hoursSavedPerDeveloper: Math.round(annualTimeSavings / teamSize),
    };
  };

  const savings = calculateSavings();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const InputCard = ({ 
    title, 
    description, 
    value, 
    onChange, 
    min = 1, 
    max, 
    step = 1,
    prefix = '',
    suffix = '',
    icon: Icon 
  }: any) => (
    <Card className="glass">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-semibold text-white">{title}</p>
              <p className="text-xs text-gray-400">{description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex items-center space-x-1 min-w-[100px]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange(Math.max(min, value - step))}
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-20 h-8 bg-gray-900 border border-gray-700 rounded px-2 text-center text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange(Math.min(max || Infinity, value + step))}
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        </div>
        <div className="mt-2 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {prefix}{value.toLocaleString()}{suffix}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Calculator className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Cost Savings Calculator</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Calculate the ROI of implementing ReleaseGuard AI in your development workflow
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Annual Savings</p>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-400">
                {formatCurrency(savings.totalAnnualSavings)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(savings.savingsPerDeveloper)} per developer
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Net Savings</p>
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {formatCurrency(savings.netSavings)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                After ReleaseGuard costs
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">ROI</p>
                <ArrowUp className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-purple-400">
                {savings.roi}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Return on investment
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-orange-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Payback Period</p>
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-orange-400">
                {savings.paybackMonths}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                months to break even
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Input Section */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Configure Your Team Parameters</CardTitle>
            <CardDescription>
              Adjust the values below to match your organization's metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputCard
                title="Team Size"
                description="Number of developers on your team"
                value={teamSize}
                onChange={setTeamSize}
                min={1}
                max={100}
                step={1}
                suffix=" developers"
                icon={Users}
              />

              <InputCard
                title="Average Hourly Rate"
                description="Developer hourly cost (salary + benefits)"
                value={avgHourlyRate}
                onChange={setAvgHourlyRate}
                min={30}
                max={250}
                step={5}
                prefix="$"
                suffix="/hr"
                icon={DollarSign}
              />

              <InputCard
                title="Code Reviews Per Month"
                description="PRs reviewed by your team monthly"
                value={reviewsPerMonth}
                onChange={setReviewsPerMonth}
                min={1}
                max={200}
                step={5}
                suffix=" reviews"
                icon={CheckCircle2}
              />

              <InputCard
                title="Manual Review Time"
                description="Hours spent per manual code review"
                value={manualReviewHours}
                onChange={setManualReviewHours}
                min={1}
                max={20}
                step={0.5}
                suffix=" hours"
                icon={Clock}
              />

              <InputCard
                title="Bugs Prevented/Month"
                description="Critical bugs caught by AI analysis"
                value={bugsPreventedPerMonth}
                onChange={setBugsPreventedPerMonth}
                min={1}
                max={50}
                step={1}
                suffix=" bugs"
                icon={AlertTriangle}
              />

              <InputCard
                title="Bug Fix Time"
                description="Average hours to fix a production bug"
                value={avgBugFixHours}
                onChange={setAvgBugFixHours}
                min={1}
                max={40}
                step={1}
                suffix=" hours"
                icon={Zap}
              />

              <InputCard
                title="Incidents Prevented/Year"
                description="Major security incidents avoided"
                value={incidentsPreventedPerYear}
                onChange={setIncidentsPreventedPerYear}
                min={0}
                max={20}
                step={1}
                suffix=" incidents"
                icon={Shield}
              />

              <InputCard
                title="Average Incident Cost"
                description="Cost per security incident (downtime, PR, legal)"
                value={avgIncidentCost}
                onChange={setAvgIncidentCost}
                min={10000}
                max={1000000}
                step={10000}
                prefix="$"
                icon={AlertTriangle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Time Savings */}
          <Card className="glass border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                Time Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Monthly Time Saved</p>
                <p className="text-2xl font-bold text-blue-400">
                  {savings.monthlyTimeSavings} hours
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Annual Time Saved</p>
                <p className="text-2xl font-bold text-blue-400">
                  {savings.annualTimeSavings} hours
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {savings.hoursSavedPerDeveloper} hours per developer
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Time Savings Value</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(savings.annualTimeSavingsCost)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bug Prevention */}
          <Card className="glass border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                Bug Prevention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Bugs Prevented/Year</p>
                <p className="text-2xl font-bold text-orange-400">
                  {bugsPreventedPerMonth * 12}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Monthly Savings</p>
                <p className="text-2xl font-bold text-orange-400">
                  {formatCurrency(savings.monthlyBugFixCost)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Annual Bug Prevention Savings</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(savings.annualBugFixSavings)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Incident Prevention */}
          <Card className="glass border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 text-red-500 mr-2" />
                Incident Prevention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Incidents Prevented/Year</p>
                <p className="text-2xl font-bold text-red-400">
                  {incidentsPreventedPerYear}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Cost Per Incident</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(avgIncidentCost)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Annual Incident Savings</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(savings.annualIncidentSavings)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Summary */}
        <Card className="glass border-green-500/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
              Investment Summary
            </CardTitle>
            <CardDescription>
              Your complete cost-benefit analysis for ReleaseGuard AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Cost */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                <div>
                  <p className="text-sm text-gray-400 mb-1">ReleaseGuard Annual Cost</p>
                  <p className="text-xs text-gray-500">
                    ${199 * teamSize}/month × 12 months
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-400">
                    {formatCurrency(savings.releaseGuardAnnualCost)}
                  </p>
                </div>
              </div>

              {/* Savings */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-900/10 border border-green-500/20">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Total Annual Savings</p>
                  <p className="text-xs text-gray-500">
                    Time + Bug Prevention + Incident Prevention
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(savings.totalAnnualSavings)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowDown className="h-8 w-8 text-gray-600" />
              </div>

              {/* Net Result */}
              <div className="flex items-center justify-between p-6 rounded-lg bg-gradient-to-r from-green-900/20 to-blue-900/20 border-2 border-green-500/30">
                <div>
                  <p className="text-lg text-gray-300 mb-1">Net Annual Benefit</p>
                  <p className="text-xs text-gray-400">
                    ROI: <strong className="text-purple-400">{savings.roi}%</strong> • 
                    Payback: <strong className="text-orange-400">{savings.paybackMonths} months</strong>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-green-400">
                    {formatCurrency(savings.netSavings)}
                  </p>
                  <Badge className="mt-2 bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Positive ROI
                  </Badge>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  30-day free trial • No credit card required
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
