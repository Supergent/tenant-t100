import dynamic from "next/dynamic";

const TodoApp = dynamic(() => import("@/components/todo-app").then(mod => mod.TodoApp), { ssr: false });

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      <TodoApp />
    </main>
  );
}
