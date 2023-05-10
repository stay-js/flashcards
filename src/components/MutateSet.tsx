import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Textarea } from '@components/Input';
import { Button } from '@components/Button';

export const setSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  cards: z.array(z.object({ front: z.string().max(200), back: z.string().max(500) })).min(1),
});

type SetSchema = z.infer<typeof setSchema>;

export const MutateSet: React.FC<{
  defaultValues?: SetSchema;
  isMutating: boolean;
  mutate: (set: SetSchema) => void;
}> = ({ defaultValues, isMutating, mutate }) => {
  const [cards, setCards] = useState<number[]>(
    Array.from(Array(defaultValues?.cards.length || 1).keys()),
  );

  const { register, handleSubmit } = useForm<SetSchema>({ resolver: zodResolver(setSchema) });

  return (
    <form onSubmit={handleSubmit(mutate)} className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{defaultValues ? 'Update set' : 'Create a new set'}</h1>
        <Button type="submit" disabled={isMutating}>
          {defaultValues && (isMutating ? 'Saving...' : 'Save')}
          {!defaultValues && (isMutating ? 'Creating...' : 'Create')}
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <TextInput
          required
          label="Name:"
          placeholder="Please provide a name for this set!"
          maxLength={50}
          defaultValue={defaultValues?.name ?? ''}
          {...register('name')}
        />

        <Textarea
          label="Description:"
          placeholder="Please provide a description for this set!"
          rows={4}
          maxLength={200}
          defaultValue={defaultValues?.description ?? ''}
          {...register('description')}
        />
      </div>

      {cards.map((index) => (
        <div key={index}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{index + 1}. Card</h2>

            {index !== 0 && (
              <Button
                color="red"
                onClick={() => setCards((value) => value.filter((_, i) => i !== index))}
              >
                Delete
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Textarea
              required
              label="Front:"
              placeholder="Please provide a front for this card!"
              rows={3}
              maxLength={200}
              defaultValue={defaultValues?.cards?.[index]?.front ?? ''}
              {...register(`cards.${index}.front`)}
            />

            <Textarea
              required
              label="Back:"
              placeholder="Please provide a back for this card!"
              rows={4}
              maxLength={500}
              defaultValue={defaultValues?.cards?.[index]?.back ?? ''}
              {...register(`cards.${index}.back`)}
            />
          </div>
        </div>
      ))}

      <Button onClick={() => setCards((value) => [...value, value.length])}>Add card</Button>
    </form>
  );
};
