import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import UserProfile from '@/app/components/user-profile';

export default async function ProfilePage() {
  const session = await auth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!session) {
    redirect('/login?callbackUrl=/profile');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">Mon Profil</h1>
        <UserProfile />
      </div>
    </main>
  );
}
