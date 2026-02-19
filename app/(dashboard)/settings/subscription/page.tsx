'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/lib/toast-context';
import { Container, Stack, Section, Grid } from '@/components/layout';
import { Card, Button, Badge, LoadingSkeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Subscription {
  id: string;
  planType: 'FREE' | 'SOLO' | 'SMALL_TEAM';
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE';
  currentPeriodEnd: string;
  usage?: {
    month: number;
    year: number;
    jobCount: number;
  }[];
}

interface UsageStats {
  currentPlan: string;
  status: string;
  currentMonthUsage: number;
  monthlyLimit: number;
  usage: Array<{
    month: number;
    year: number;
    jobCount: number;
  }>;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient();
  const apiClient = new ApiClient(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  });

  useEffect(() => {
    loadSubscription();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      showToast('Subscription activated successfully!', 'success');
      window.history.replaceState({}, '', window.location.pathname);
      loadSubscription();
    } else if (urlParams.get('canceled') === 'true') {
      showToast('Subscription checkout was cancelled', 'info');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [showToast]);

  const loadSubscription = async () => {
    try {
      const [subData, usageData] = await Promise.all([
        apiClient.get<Subscription>('/subscriptions'),
        apiClient.get<UsageStats>('/subscriptions/usage'),
      ]);
      setSubscription(subData);
      setUsageStats(usageData);
    } catch (error: any) {
      showToast(error.message || 'Failed to load subscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (planType: 'FREE' | 'SOLO' | 'SMALL_TEAM') => {
    if (planType === 'FREE') {
      setUpdating(true);
      try {
        await apiClient.put('/subscriptions/plan', { planType });
        showToast('Subscription plan updated', 'success');
        loadSubscription();
      } catch (error: any) {
        showToast(error.message || 'Failed to update plan', 'error');
      } finally {
        setUpdating(false);
      }
    } else {
      setUpdating(true);
      try {
        const { url } = await apiClient.post<{ sessionId: string; url: string }>(
          '/payments/create-checkout-session',
          { planType },
        );
        if (url) {
          window.location.href = url;
        } else {
          showToast('Failed to create checkout session', 'error');
        }
      } catch (error: any) {
        showToast(error.message || 'Failed to start checkout', 'error');
        setUpdating(false);
      }
    }
  };

  const handleCancel = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    setUpdating(true);
    try {
      await apiClient.post('/subscriptions/cancel');
      showToast('Subscription cancelled', 'success');
      loadSubscription();
    } catch (error: any) {
      showToast(error.message || 'Failed to cancel subscription', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Section background="subtle" padding="lg">
        <Container size="lg">
          <LoadingSkeleton type="card" count={2} />
        </Container>
      </Section>
    );
  }

  const plans = [
    {
      type: 'FREE' as const,
      name: 'Free',
      price: '£0',
      limit: 10,
      features: ['Up to 10 jobs per month', 'Basic features', 'Email support'],
    },
    {
      type: 'SOLO' as const,
      name: 'Solo',
      price: '£9.99',
      limit: 50,
      features: ['Up to 50 jobs per month', 'All features', 'Priority support'],
    },
    {
      type: 'SMALL_TEAM' as const,
      name: 'Small Team',
      price: '£29.99',
      limit: 200,
      features: ['Up to 200 jobs per month', 'All features', 'Priority support', 'Team management'],
    },
  ];

  const currentPlan = plans.find((p) => p.type === subscription?.planType);
  const usagePercentage = usageStats
    ? (usageStats.currentMonthUsage / usageStats.monthlyLimit) * 100
    : 0;
  const isOverLimit = usageStats && usageStats.currentMonthUsage >= usageStats.monthlyLimit;
  const isNearLimit =
    usageStats && usageStats.currentMonthUsage >= usageStats.monthlyLimit * 0.8 && !isOverLimit;

  return (
    <Section background="subtle" padding="lg">
      <Container size="lg">
        <Link href="/settings/business" className="mb-6 inline-block">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            }
          >
            Back to Settings
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[var(--gray-900)] mb-2">
            Subscription Management
          </h1>
          <p className="text-[var(--gray-600)] text-lg">Manage your subscription plan and usage</p>
        </div>

        {/* Current Plan */}
        {subscription && usageStats && (
          <Card variant="elevated" padding="lg" className="mb-8">
            <Stack direction="row" justify="between" align="start" className="mb-6">
              <div>
                <Stack direction="row" spacing="md" align="center" className="mb-2">
                  <h2 className="text-2xl font-bold text-[var(--gray-900)]">Current Plan</h2>
                  <Badge
                    variant={subscription.status === 'ACTIVE' ? 'success' : 'warning'}
                    size="md"
                  >
                    {subscription.status}
                  </Badge>
                </Stack>
                <p className="text-lg font-bold text-[var(--gray-900)]">{currentPlan?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-[var(--primary-600)]">
                  {currentPlan?.price}
                  <span className="text-sm font-normal text-[var(--gray-600)]">/month</span>
                </p>
              </div>
            </Stack>

            {/* Usage */}
            <Card variant="outlined" padding="md" className="bg-[var(--gray-50)] mb-4">
              <Stack spacing="sm">
                <Stack direction="row" justify="between" align="center">
                  <span className="text-sm font-semibold text-[var(--gray-700)]">
                    This Month&apos;s Usage
                  </span>
                  <span className="text-sm font-bold text-[var(--gray-900)]">
                    {usageStats.currentMonthUsage} / {usageStats.monthlyLimit} jobs
                  </span>
                </Stack>
                <div className="w-full bg-[var(--gray-200)] rounded-full h-3">
                  <div
                    className={cn(
                      'h-3 rounded-full transition-all',
                      isOverLimit
                        ? 'bg-[var(--error-500)]'
                        : isNearLimit
                          ? 'bg-[var(--warning-500)]'
                          : 'bg-[var(--success-500)]',
                    )}
                    style={{
                      width: `${Math.min(usagePercentage, 100)}%`,
                    }}
                  />
                </div>
                {isOverLimit && (
                  <p className="text-sm text-[var(--error-600)] font-semibold">
                    You&apos;ve reached your monthly limit. Please upgrade to continue.
                  </p>
                )}
              </Stack>
            </Card>

            <p className="text-sm text-[var(--gray-600)]">
              Current period ends:{' '}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB')}
            </p>
          </Card>
        )}

        {/* Available Plans */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-6">Available Plans</h2>
          <Grid cols={3} gap="lg">
            {plans.map((plan) => {
              const isCurrentPlan = subscription?.planType === plan.type;
              return (
                <Card
                  key={plan.type}
                  variant={isCurrentPlan ? 'elevated' : 'outlined'}
                  padding="lg"
                  className={cn(
                    'relative',
                    isCurrentPlan && 'border-2 border-[var(--primary-500)] bg-[var(--primary-50)]',
                  )}
                >
                  {isCurrentPlan && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="success" size="sm">
                        Current
                      </Badge>
                    </div>
                  )}
                  <Stack spacing="md">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">{plan.name}</h3>
                      <p className="text-3xl font-extrabold text-[var(--primary-600)] mb-1">
                        {plan.price}
                        <span className="text-sm font-normal text-[var(--gray-600)]">/month</span>
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-[var(--gray-700)]">
                          <svg
                            className="w-5 h-5 text-[var(--success-600)] mr-2 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {isCurrentPlan ? (
                      <Button variant="secondary" size="lg" disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => handleUpdatePlan(plan.type)}
                        isLoading={updating}
                        className="w-full"
                      >
                        Select Plan
                      </Button>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </Grid>
        </Card>

        {/* Cancel Subscription */}
        {subscription && subscription.status === 'ACTIVE' && subscription.planType !== 'FREE' && (
          <Card variant="elevated" padding="lg">
            <Stack spacing="md">
              <h2 className="text-2xl font-bold text-[var(--gray-900)]">Cancel Subscription</h2>
              <p className="text-[var(--gray-700)]">
                Cancelling your subscription will stop automatic renewals. You&apos;ll continue to
                have access until the end of your current billing period.
              </p>
              <Button variant="danger" size="lg" onClick={handleCancel} isLoading={updating}>
                Cancel Subscription
              </Button>
            </Stack>
          </Card>
        )}
      </Container>
    </Section>
  );
}
