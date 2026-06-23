import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signupUser, loginUser } from '@/features/auth/api/auth';
import { useAuthContext } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import GoogleLogo from '@/assets/google-color-svgrepo-com.svg';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const signupSchema = z
  .object({
    firstname: z.string().min(2, 'First name is too short'),
    lastname: z.string().min(2, 'Last name is too short'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must match'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignUp() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      // 1. Sign up
      await signupUser({
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
      });

      toast.success('Account created successfully!');

      // 2. Auto login
      const loginRes = await loginUser({
        email: values.email,
        password: values.password,
      });

      login(loginRes.data.user, loginRes.data.accessToken);

      // Redirect to home as requested
      navigate('/');
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error(
        error.response?.data?.message || 'Something went wrong during signup',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account with Titsate</CardTitle>
          <CardDescription>
            Enter your details below to create an account
          </CardDescription>
          <CardAction>
            <Link to="/login">
              <Button variant="link">Sign In</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    placeholder="John"
                    {...register('firstname')}
                  />
                  {errors.firstname && (
                    <p className="text-xs text-destructive">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    placeholder="Doe"
                    {...register('lastname')}
                  />
                  {errors.lastname && (
                    <p className="text-xs text-destructive">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="relative w-full py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/google`;
            }}
          >
            <img src={GoogleLogo} alt="Google" className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              ' text-muted-foreground hover:text-foreground  flex items-center gap-2 transition-all font-medium',
            )}
          >
            <ArrowLeft className="size-4" />
            Return to Website
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
