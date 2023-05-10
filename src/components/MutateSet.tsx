import { useState } from 'react';
import { z } from 'zod';
import { TextInput, Textarea } from '@components/Input';
import { Button } from '@components/Button';

export const setSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  cards: z.array(z.object({ front: z.string().max(200), back: z.string().max(500) })).min(1),
});

type SetSchema = z.infer<typeof setSchema>;

const emptyDefaultValues: SetSchema = {
  name: '',
  description: '',
  cards: [
    {
      front: '',
      back: '',
    },
  ],
};

export const MutateSet: React.FC<{
  defaultValues?: SetSchema;
  isMutating: boolean;
  mutate: (set: SetSchema) => void;
}> = ({ defaultValues, isMutating, mutate }) => {
  const [values, setValues] = useState<SetSchema>(defaultValues ?? emptyDefaultValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(values);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-6">
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
          value={values.name}
          maxLength={50}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />

        <Textarea
          label="Description:"
          placeholder="Please provide a description for this set!"
          rows={4}
          maxLength={200}
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />
      </div>

      {values.cards.map((card, index) => (
        <div key={index}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{index + 1}. Card</h2>

            {index !== 0 && (
              <Button
                color="red"
                onClick={() =>
                  setValues({ ...values, cards: values.cards.filter((_, i) => i !== index) })
                }
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
              value={card.front}
              onChange={(e) =>
                setValues({
                  ...values,
                  cards: values.cards.map((c, i) =>
                    i === index ? { ...c, front: e.target.value } : c,
                  ),
                })
              }
            />

            <Textarea
              required
              label="Back:"
              placeholder="Please provide a back for this card!"
              rows={4}
              maxLength={500}
              value={card.back}
              onChange={(e) =>
                setValues({
                  ...values,
                  cards: values.cards.map((c, i) =>
                    i === index ? { ...c, back: e.target.value } : c,
                  ),
                })
              }
            />
          </div>
        </div>
      ))}

      <Button
        onClick={() => setValues({ ...values, cards: [...values.cards, { front: '', back: '' }] })}
      >
        Add card
      </Button>
    </form>
  );
};
