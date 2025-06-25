import * as Dialog from '@radix-ui/react-dialog';
import { CreateWorkspaceFeatureParam, CreateWorkspaceParam } from "@/api/workspace";
import { useCreateWorkspaceWithFeatureMutation } from "@/api/workspace.hook";
import { useState } from "react";
import { X } from 'lucide-react';

interface WorkspaceCreateButtonWithModalProps {
  teamId: string;
  onCreated?: () => void;
}

export default function WorkspaceCreateButtonWithModal(props: WorkspaceCreateButtonWithModalProps) {
  const { teamId, onCreated } = props;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createWorkspaceWithFeatureMutation = useCreateWorkspaceWithFeatureMutation({ teamId });

  const handleCreate = async () => {
    if (!teamId) return;
    if (!name.trim()) return;
    const workspaceParam: CreateWorkspaceParam = {
      name: name.trim(),
      description: description.trim() || undefined
    }
    const featureParam: CreateWorkspaceFeatureParam = {
      featureType: 'chat',
      order: 0,
      isDefault: true
    }

    createWorkspaceWithFeatureMutation.mutate({
      workspace: workspaceParam,
      feature: featureParam
    }, {
      onSuccess: () => {
        setName('');
        setDescription('');
        setOpen(false);
        onCreated?.();
      },
      onError: (error) => {
        console.error('워크스페이스 생성 실패:', error);
      }
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="text-gray-500 hover:text-gray-700 text-lg leading-none">
          ＋
        </button>
        {/* <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + 워크스페이스 생성
        </button> */}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold">새 워크스페이스 만들기</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">워크스페이스 이름</label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 디자인 채널"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">설명</label>
              <textarea
                className="w-full border px-3 py-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="이 워크스페이스의 용도를 적어주세요"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">취소</button>
              </Dialog.Close>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                생성
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}