// app/patient/_layout.tsx
import { Tabs } from 'expo-router';

export default function PatientTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      
    </Tabs>
  );
}
