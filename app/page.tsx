import { redirect } from 'next/navigation';

// The board lives at /us so this app can later host other views next to it.
export default function Home() {
  redirect('/us');
}
