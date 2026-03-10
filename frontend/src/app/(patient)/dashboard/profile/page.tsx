'use client';

import ProfileForm from '@/src/features/patient/components/ProfileForm';

export default function ProfilePage() {

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">

        My Profile

      </h1>

      <ProfileForm />

    </div>

  );

}