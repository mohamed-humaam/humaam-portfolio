import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">H</span>
          </div>
          <h1 className="text-2xl font-display font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to manage your portfolio
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
