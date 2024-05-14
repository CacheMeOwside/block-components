import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useAuthor } from './context';

interface NameProps {
  tagName?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}

export const Name: React.FC<NameProps> = (props) => {
  const { tagName: TagName = 'span', ...rest } = props;
  const { name, link } = useAuthor();

  const wrapperProps = { ...rest };

  if (TagName === 'a' && link) {
    wrapperProps.href = link;
  }

  return <TagName {...wrapperProps}>{name}</TagName>;
};

interface FirstNameProps {
	tagName?: keyof JSX.IntrinsicElements;
	[key: string]: any;
}

export const FirstName: React.FC<FirstNameProps> = (props) => {
	const { tagName: TagName = 'span', ...rest } = props;
	const { first_name: firstName } = useAuthor();

	return <TagName {...rest}>{firstName}</TagName>;
};

interface LastNameProps {
	tagName?: keyof JSX.IntrinsicElements;
	[key: string]: any;
}

export const LastName: React.FC<LastNameProps> = (props) => {
	const { tagName: TagName = 'span', ...rest } = props;
	const { last_name: lastName } = useAuthor();

	return <TagName {...rest}>{lastName}</TagName>;
};

function useDefaultAvatar() {
	const { avatarURL: defaultAvatarUrl } = useSelect((select) => {
		const { getSettings } = select(blockEditorStore);
		const { __experimentalDiscussionSettings } = getSettings();
		return __experimentalDiscussionSettings;
	}, []);
	return defaultAvatarUrl;
}

interface AvatarProps {
	[key: string]: any;
}

export const Avatar: React.FC<AvatarProps> = (props) => {
	const { ...rest } = props;
	const authorDetails = useAuthor();

	const avatarUrls = authorDetails?.avatar_urls ? Object.values(authorDetails.avatar_urls) : null;
	const defaultAvatar = useDefaultAvatar();

	const avatarSourceUrl = avatarUrls ? avatarUrls[avatarUrls.length - 1] : defaultAvatar;

	return <img src={avatarSourceUrl} {...rest} />;
};

interface BioProps {
	tagName?: keyof JSX.IntrinsicElements;
	[key: string]: any;
}

export const Bio: React.FC<BioProps> = (props) => {
	const { tagName: TagName = 'p', ...rest } = props;
	const { description } = useAuthor();

	return <TagName {...rest}>{description}</TagName>;
};

interface EmailProps {
	[key: string]: any;
}

export const Email: React.FC<EmailProps> = (props) => {
	const { ...rest } = props;
	const { email } = useAuthor();

	return (
		<a href={`mailto:${email}`} {...rest}>
			{email}
		</a>
	);
};