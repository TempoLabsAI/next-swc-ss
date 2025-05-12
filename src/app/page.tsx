import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  LineChart,
  PiggyBank,
  Wallet,
  BellRing,
  Shield,
  BarChart3,
  Banknote,
  Landmark,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive Financial Management
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides real-time insights into your finances with
              powerful tools to help you make smarter decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <LineChart className="w-6 h-6" />,
                title: "Spending Analytics",
                description:
                  "Track and categorize your transactions automatically",
              },
              {
                icon: <PiggyBank className="w-6 h-6" />,
                title: "Budget Tracking",
                description: "Set goals and monitor your progress in real-time",
              },
              {
                icon: <Wallet className="w-6 h-6" />,
                title: "Net Worth Dashboard",
                description:
                  "Visualize your assets and liabilities in one place",
              },
              {
                icon: <BellRing className="w-6 h-6" />,
                title: "Smart Notifications",
                description:
                  "Get alerts for unusual spending and bill reminders",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bank Integration Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Secure Bank Account Integration
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your accounts securely using bank-level encryption. We
                use Plaid to ensure your credentials are never stored on our
                servers.
              </p>
              <ul className="space-y-4">
                {[
                  "Connect multiple accounts from different institutions",
                  "Automatic transaction categorization and analysis",
                  "Real-time balance updates across all your accounts",
                  "Historical data import for immediate insights",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Shield className="w-5 h-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-6">
                <div className="flex items-center justify-center h-full">
                  <img
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80"
                    alt="Bank account connection interface"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect in Minutes</h3>
              <p className="text-gray-600 mb-4">
                Link your accounts securely with just a few clicks and start
                getting insights immediately.
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Connect Your Accounts
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AI Investment Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-white p-6 rounded-xl shadow-lg">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-6">
                <div className="flex items-center justify-center h-full">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                    alt="Investment recommendations interface"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Personalized Recommendations
              </h3>
              <p className="text-gray-600 mb-4">
                Our AI analyzes your spending patterns and financial goals to
                provide tailored investment suggestions.
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Get Recommendations
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </a>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">
                AI-Powered Investment Suggestions
              </h2>
              <p className="text-gray-600 mb-6">
                Our intelligent system analyzes your financial situation and
                market conditions to recommend the best investment opportunities
                for you.
              </p>
              <ul className="space-y-4">
                {[
                  "Personalized recommendations based on your risk tolerance",
                  "Market analysis and timing suggestions",
                  "Diversification strategies for your portfolio",
                  "Goal-based investment planning",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <BarChart3 className="w-5 h-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">$2.5B+</div>
              <div className="text-green-100">Assets Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15%</div>
              <div className="text-green-100">Average Savings Increase</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your financial journey. No hidden
              fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Take Control of Your Financial Future
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial lives
            with our comprehensive platform.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Connect Your Accounts
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
