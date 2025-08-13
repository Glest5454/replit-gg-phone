import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { TaskManagerProvider } from "@/context/TaskManagerContext";
import { usePhone } from "@/hooks/usePhone";

function PhonePageInner() {
  const { navigateToScreen } = usePhone();

  const handleAppSwitch = (appId: string) => {
    navigateToScreen(appId as any);
  };

  return (
    <TaskManagerProvider onAppSwitch={handleAppSwitch}>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
        <PhoneFrame />
      </div>
    </TaskManagerProvider>
  );
}

export default function PhonePage() {
  return <PhonePageInner />;
}
