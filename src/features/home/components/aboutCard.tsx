import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Props = {
  title: string;
  description: string;
  icon: string;
};

export default function AboutCard({ title, description, icon }: Props) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 border-0">
      <div className="absolute inset-0  aspect-video text-center " />
      <img
        src={icon}
        alt="Event cover"
        className="relative  mx-auto  aspect-video w-1/3 object-cover brightness-60 grayscale dark:brightness-0"
      />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
