import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Mail, MessageSquare, Send, User } from 'lucide-react';
import api from '@/lib/axios';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject is too short'),
  message: z.string().min(10, 'Message is too short'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsLoading(true);
    try {
      await api.post('/feedback', values);
      toast.success('Your message has been sent. We will get back to you soon!');
      reset();
    } catch (error: any) {
      console.error('Failed to send feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-50 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96  rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto  flex flex-col gap-10">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Talk to Us
            </h1>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Have questions about Titsate? We're here to help you on your learning journey. 
              Drop us a message and our team will get back to you within 24 hours.
            </p>
          </div>

          
        </div>

        {/* Contact Form */}
        <Card className="md:col-span-3 border-none  rounded-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">Send a Message</CardTitle>
            <CardDescription>
              Please fill out the form below and we'll respond as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-wider font-bold text-muted-foreground ml-1">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="pl-10 h-12 bg-muted/30 focus-visible:ring-primary/20"
                      {...register('name')}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive font-medium px-1">{errors.name.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider font-bold text-muted-foreground ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10 h-12 bg-muted/30 focus-visible:ring-primary/20"
                      {...register('email')}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium px-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subject" className="text-xs uppercase tracking-wider font-bold text-muted-foreground ml-1">Subject</Label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  className="h-12 bg-muted/30 focus-visible:ring-primary/20"
                  {...register('subject')}
                  disabled={isLoading}
                />
                {errors.subject && (
                  <p className="text-xs text-destructive font-medium px-1">{errors.subject.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message" className="text-xs uppercase tracking-wider font-bold text-muted-foreground ml-1">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message here..."
                  className="min-h-[150px] bg-muted/30 focus-visible:ring-primary/20 resize-none md:text-base"
                  {...register('message')}
                  disabled={isLoading}
                />
                {errors.message && (
                  <p className="text-xs text-destructive font-medium px-1">{errors.message.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 size-5 animate-spin" />
                ) : (
                  <Send className="mr-2 size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ContactPage;
