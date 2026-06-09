import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreatorProfilePanel() {
  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-card/80 p-6 shadow-sm">
      <div>
        <h3 className="text-2xl font-bold">Profile management</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Update your creator profile and contact details.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <Label
            htmlFor="creator-firstname"
            className="mb-2 block text-sm font-medium"
          >
            First name
          </Label>
          <Input
            id="creator-firstname"
            defaultValue=""
            placeholder="First name"
          />
        </div>

        <div>
          <Label
            htmlFor="creator-lastname"
            className="mb-2 block text-sm font-medium"
          >
            Last name
          </Label>
          <Input
            id="creator-lastname"
            defaultValue=""
            placeholder="Last name"
          />
        </div>

        <div>
          <Label
            htmlFor="creator-email"
            className="mb-2 block text-sm font-medium"
          >
            Email address
          </Label>
          <Input
            id="creator-email"
            type="email"
            defaultValue=""
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Your profile information is used to personalize your creator
            dashboard and course listings.
          </p>
        </div>
        <Button className="w-full sm:w-auto">Save profile</Button>
      </div>
    </div>
  );
}

export default CreatorProfilePanel;
