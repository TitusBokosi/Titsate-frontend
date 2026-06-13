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
  icon: React.ElementType;
};

export default function AboutCard({ title, description, icon: Icon }: Props) {
  return (
    <Card className=" relative mx-auto w-full max-w-sm pt-0 border-0">
      
<div className='bg-white w-fit rounded-xl'>
        <Icon className="relative mx-auto w-1/3 h-20 text-primary" />
</div>

      <CardHeader>
        <CardTitle className='font-bold text-xl'>{title}</CardTitle>
        <CardDescription className="whitespace-pre-line ">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}