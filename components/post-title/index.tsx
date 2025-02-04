import { useEntityProp } from '@wordpress/core-data';
import { RichText, store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { usePost } from '../../hooks';

interface PostTitleProps<TElementType extends React.ElementType> {
	tagName?: TElementType | keyof JSX.IntrinsicElements;
}

type PostTitlePropsWithOmit<TElementType extends React.ElementType> = PostTitleProps<TElementType> & Omit<React.ComponentPropsWithoutRef<TElementType>, keyof PostTitleProps<TElementType>>;

export const PostTitle = <TElementType extends React.ElementType = 'h1'>({
	tagName: TagName = 'h1',
	...rest
}: PostTitlePropsWithOmit<TElementType> ) => {
	const { postId, postType, isEditable } = usePost();

	const [rawTitle = '', setTitle, fullTitle] = useEntityProp(
		'postType',
		postType,
		'title',
		postId,
	);

	const titlePlaceholder = useSelect(
		(select) => select(blockEditorStore).getSettings().titlePlaceholder,
		[],
	);

	if (!isEditable) {
		// eslint-disable-next-line react/no-danger
		return <TagName {...rest} dangerouslySetInnerHTML={{ __html: fullTitle?.rendered }} />;
	}

	return (
		<RichText
			tagName={TagName}
			placeholder={titlePlaceholder}
			value={rawTitle}
			onChange={setTitle}
			allowedFormats={[]}
			{...rest}
		/>
	);
};
