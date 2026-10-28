import { ChangeEvent, DragEvent, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { resources } from 'app/routes/resources';
import { hasVisibleBody, trimTags } from 'modules/blog/application/blog-editor-state';
import { useBlogEditorPage } from 'modules/blog/application/hooks/useBlogEditorPage';
import { BlogStatus } from 'modules/blog/domain/entities/blog.entity';
import {
  EditorialField,
  TranslationLocaleSelect,
} from 'modules/blog/ui/pages/BlogEditorPage/components/EditorialFields';
import BlogArticleContent from 'modules/blog/ui/shared/components/BlogArticleContent';
import BlogRichTextEditor from 'modules/blog/ui/shared/components/BlogRichTextEditor';
import BlogStatusChip from 'modules/blog/ui/shared/components/BlogStatusChip';
import { prepareBlogArticle } from 'modules/blog/ui/shared/lib/article-content';
import EmptyState from 'shared/components/common/EmptyState';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import PageLoader from 'shared/components/loading/PageLoader';
import BackToListButton from 'shared/components/sections/common/BackToListButton';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import StyledTextField from 'shared/components/styled/StyledTextField';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const BlogEditorPage = () => {
  const {
    currentUser,
    post,
    isLoading,
    topicOptions,
    isCreating,
    isUpdating,
    isSubmitting,
    isCreateMode,
    isBusy,
    currentStatus,
    canSubmit,
    submitDisabled,
    saveLabel,
    headerTitle,
    headerSubtitle,
    translations,
    tags,
    setTags,
    selectedTopics,
    setSelectedTopics,
    canonicalLink,
    setCanonicalLink,
    setImageFile,
    setRemoveImage,
    handlePersist,
    attachImage,
    hasInitialized,
    activeLocale,
    setActiveLocale,
    imagePreview,
    setImagePreview,
    activeTranslation,
    titleError,
    bodyError,
    updateActiveTranslation,
    clearLocaleError,
  } = useBlogEditorPage();

  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const previewArticle = useMemo(
    () => prepareBlogArticle(activeTranslation.body, [], activeTranslation.title),
    [activeTranslation.body, activeTranslation.title],
  );

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    attachImage(event.target.files?.[0] ?? null);
  };

  const handleImageDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    attachImage(event.dataTransfer.files?.[0] ?? null);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isCreateMode && (isLoading || (post && !hasInitialized))) {
    return <PageLoader />;
  }

  if (!isCreateMode && !post && !isLoading) {
    return (
      <Box sx={responsivePagePaddingSx}>
        <Alert severity="warning">{t('blog.editor.notFound')}</Alert>
      </Box>
    );
  }

  if (!isCreateMode && post && !post.canEdit) {
    return (
      <Box sx={responsivePagePaddingSx}>
        <Stack spacing={2}>
          <Alert severity="error">{t('blog.editor.forbidden')}</Alert>
          <BackToListButton to={resources.Blog} />
        </Stack>
      </Box>
    );
  }

  if (!currentUser)
    return (
      <FramedPage>
        <PageHeader title={headerTitle} backTo={resources.Blog} />
        <EmptyState kind="auth" title={t('blog.editor.authRequired')} />
      </FramedPage>
    );

  return (
    <FramedPage>
      <PageHeader
        variant="detail"
        title={headerTitle}
        subtitle={headerSubtitle}
        backTo={resources.Blog}
        actionComponent={<BlogStatusChip status={currentStatus} />}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: 'minmax(0,1fr) 340px' },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            gap={2}
            alignItems="center"
            flexWrap="wrap"
            sx={{ px: 'var(--kep-content-inset)', borderBottom: 1, borderColor: 'divider' }}
          >
            <Tabs
              value={isPreview ? 'preview' : 'write'}
              onChange={(_, value) => setIsPreview(value === 'preview')}
              aria-label={t('blog.editor.storyTitle')}
            >
              <Tab
                value="write"
                label={t('blog.editor.actions.writeStory')}
                id="blog-write-tab"
                aria-controls="blog-writing-panel"
              />
              <Tab
                value="preview"
                label={t('blog.editor.previewLabel')}
                id="blog-preview-tab"
                aria-controls="blog-preview-panel"
              />
            </Tabs>
            <Box sx={{ width: 140, ml: 'auto', py: 1 }}>
              <TranslationLocaleSelect
                activeLocale={activeLocale}
                onChange={setActiveLocale}
                translations={translations}
              />
            </Box>
          </Stack>
          <Box
            role="tabpanel"
            id="blog-writing-panel"
            aria-labelledby="blog-write-tab"
            hidden={isPreview}
            sx={{ p: 'var(--kep-content-inset)' }}
          >
            <Stack direction="column" spacing={3} sx={{ maxWidth: 820, mx: 'auto' }}>
              <EditorialField
                label={t('blog.editor.fields.title')}
                value={activeTranslation.title}
                onChange={(value) => {
                  updateActiveTranslation({ title: value });
                  clearLocaleError(activeLocale, 'title');
                }}
                placeholder={t('blog.editor.fields.titlePlaceholder')}
                maxLength={75}
                error={titleError}
              />
              <EditorialField
                label={t('blog.editor.fields.subText')}
                value={activeTranslation.subtitle}
                onChange={(value) => updateActiveTranslation({ subtitle: value })}
                placeholder={t('blog.editor.fields.subTextPlaceholder')}
                maxLength={140}
                multiline
                minRows={2}
              />
              <Box sx={{ '& .ql-editor': { maxHeight: { xs: 420, md: 640 }, overflowY: 'auto' } }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {t('blog.editor.fields.body')}
                </Typography>
                <BlogRichTextEditor
                  key={activeLocale}
                  value={activeTranslation.body}
                  onChange={(body) => {
                    updateActiveTranslation({ body });
                    clearLocaleError(activeLocale, 'body');
                  }}
                  placeholder={t('blog.editor.fields.bodyPlaceholder')}
                />
                {bodyError && (
                  <Typography variant="caption" color="error.main" role="alert">
                    {bodyError}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
          <Box
            role="tabpanel"
            id="blog-preview-panel"
            aria-labelledby="blog-preview-tab"
            hidden={!isPreview}
            sx={{ p: 'var(--kep-content-inset)' }}
          >
            <Stack direction="column" spacing={3} sx={{ maxWidth: '72ch', mx: 'auto' }}>
              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt={t('blog.editor.fields.coverImage')}
                  sx={{ width: '100%', maxHeight: 360, objectFit: 'contain' }}
                />
              )}
              {activeTranslation.title && (
                <Typography
                  component="h2"
                  variant="h3"
                  sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}
                >
                  <MixedText>{activeTranslation.title}</MixedText>
                </Typography>
              )}
              {activeTranslation.subtitle && (
                <Typography variant="body1" color="text.secondary">
                  {activeTranslation.subtitle}
                </Typography>
              )}
              {hasVisibleBody(activeTranslation.body) ? (
                <BlogArticleContent html={previewArticle.html} />
              ) : (
                <EmptyState kind="writing" title={t('blog.editor.previewEmpty')} compact />
              )}
            </Stack>
          </Box>
        </Box>
        <Box
          component="aside"
          sx={{
            borderLeft: { lg: 1 },
            borderTop: { xs: 1, lg: 0 },
            borderColor: { xs: 'divider', lg: 'divider' },
            minWidth: 0,
          }}
        >
          <Stack direction="column" gap={3} sx={{ p: 3 }}>
            <Box>
              <Typography component="h2" variant="h6">
                <MixedText>{t('blog.editor.detailsTitle')}</MixedText>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('blog.editor.translationHint')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('blog.editor.fields.coverImage')}
              </Typography>
              <Box
                component="button"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleImageDrop}
                sx={{
                  width: '100%',
                  p: 0,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.level1',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  font: 'inherit',
                  '&:hover': { borderColor: 'primary.main' },
                  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' },
                }}
              >
                {imagePreview ? (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt={t('blog.editor.fields.coverImage')}
                    sx={{
                      display: 'block',
                      width: '100%',
                      aspectRatio: '16 / 9',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <PatternArtwork
                    kind="writing"
                    sx={{ width: 180, display: 'block', mx: 'auto' }}
                  />
                )}
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    display: 'block',
                    py: 1.5,
                    borderTop: 1,
                    borderColor: 'divider',
                    color: 'primary.main',
                  }}
                >
                  {t(
                    imagePreview
                      ? 'blog.editor.fields.coverImageReplace'
                      : 'blog.editor.actions.uploadImage',
                  )}{' '}
                  ↗
                </Typography>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1, lineHeight: 1.6 }}
              >
                {t('blog.editor.fields.coverImageHelper')}
              </Typography>
              {imagePreview && (
                <Button size="small" color="error" onClick={handleRemoveImage} sx={{ mt: 1 }}>
                  {t('blog.editor.actions.removeImage')}
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={handleImageSelect}
              />
            </Box>
            <Autocomplete
              multiple
              options={topicOptions}
              value={selectedTopics}
              onChange={(_, value) => setSelectedTopics(value)}
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  label={t('blog.editor.fields.topics')}
                  placeholder={t('blog.editor.fields.topicsPlaceholder')}
                />
              )}
            />
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={tags}
              onChange={(_, value) => setTags(trimTags(value))}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  label={t('blog.editor.fields.tags')}
                  placeholder={t('blog.editor.fields.tagsPlaceholder')}
                  helperText={t('blog.editor.fields.tagsLimit')}
                />
              )}
            />
            <StyledTextField
              label={t('blog.editor.fields.canonicalLink')}
              value={canonicalLink}
              onChange={(event) => setCanonicalLink(event.target.value)}
              placeholder={t('blog.editor.fields.canonicalLinkPlaceholder')}
              fullWidth
            />
          </Stack>
        </Box>
      </Box>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{
          p: 'var(--kep-content-inset)',
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ maxWidth: 480, display: { xs: 'none', sm: 'block' } }}
        >
          {headerSubtitle}
        </Typography>
        <Stack direction="row" gap={1.5} flexWrap="wrap">
          <Button
            variant={currentStatus === BlogStatus.Published ? 'contained' : 'outlined'}
            onClick={() => void handlePersist('draft')}
            disabled={isBusy}
            startIcon={
              isCreating || isUpdating ? <CircularProgress color="inherit" size={16} /> : undefined
            }
          >
            {saveLabel}
          </Button>
          {currentStatus !== BlogStatus.Published && canSubmit && (
            <Button
              variant="contained"
              onClick={() => void handlePersist('submit')}
              disabled={submitDisabled}
              startIcon={isSubmitting ? <CircularProgress color="inherit" size={16} /> : undefined}
            >
              {t('blog.editor.actions.submitForReview')}
            </Button>
          )}
        </Stack>
      </Stack>
    </FramedPage>
  );
};
export default BlogEditorPage;
