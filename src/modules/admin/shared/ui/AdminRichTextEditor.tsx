import { ComponentProps } from 'react';
import RichTextEditor from 'shared/components/form/RichTextEditor';

type AdminRichTextEditorProps = ComponentProps<typeof RichTextEditor> & {
  compact?: boolean;
};

const AdminRichTextEditor = ({ compact = true, ...props }: AdminRichTextEditorProps) => {
  return <RichTextEditor compact={compact} {...props} />;
};

export type { AdminRichTextEditorProps };
export default AdminRichTextEditor;
