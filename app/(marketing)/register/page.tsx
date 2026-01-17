import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function RegisterPage() {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
      <Card title="Tell us your preferences">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-700">Language</label>
            <select className="w-full rounded-xl border border-ink-100 p-3 text-sm">
              <option>Hinglish</option>
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-ink-700">Interests</p>
            <div className="flex flex-wrap gap-2">
              {["Sports", "Teer", "Astrology"].map((interest) => (
                <label key={interest} className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-xs">
                  <input type="checkbox" defaultChecked={interest === "Sports"} />
                  {interest}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-700">Favorite teams (optional)</label>
            <input
              type="text"
              placeholder="Ex: Super Kings, City"
              className="w-full rounded-xl border border-ink-100 p-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-700">Teer houses followed (optional)</label>
            <input
              type="text"
              placeholder="Ex: Shillong, Khanapara"
              className="w-full rounded-xl border border-ink-100 p-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-700">Response style</label>
            <div className="flex flex-wrap gap-2">
              {["short", "balanced", "detailed"].map((style) => (
                <label key={style} className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-xs">
                  <input type="radio" name="style" defaultChecked={style === "balanced"} />
                  {style}
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Save preferences
          </Button>
          <p className="text-xs text-ink-400">Preferences will be saved via /api/prefs.</p>
        </form>
      </Card>

      <Card title="Choose a plan">
        <div className="space-y-4">
          {[
            { title: "₹99", desc: "10 messages/day", action: "Select ₹99 plan" },
            { title: "₹499", desc: "Unlimited messages", action: "Select ₹499 plan" }
          ].map((plan) => (
            <div key={plan.title} className="rounded-xl border border-ink-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-ink-900">{plan.title}</p>
                  <p className="text-xs text-ink-500">{plan.desc}</p>
                </div>
                <Button variant="secondary" size="sm">
                  {plan.action}
                </Button>
              </div>
            </div>
          ))}
          <p className="text-xs text-ink-400">Payments are handled on the backend.</p>
        </div>
      </Card>
    </div>
  );
}
