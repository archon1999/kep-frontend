import { useTranslation } from 'react-i18next';
import RichTextEditor from 'shared/components/form/RichTextEditor';

interface BlogRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const BlogRichTextEditor = ({ value, onChange, placeholder }: BlogRichTextEditorProps) => {
  const { t } = useTranslation();

  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      loadErrorText={t('blog.editor.loadError')}
      hintText={t('blog.editor.safeFormattingHint')}
    />
  );
};

export default BlogRichTextEditor;
