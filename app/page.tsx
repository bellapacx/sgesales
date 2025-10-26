import LoginForm from "./components/auth/LoginForm";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <LoginForm />
    </div>
  );
}
