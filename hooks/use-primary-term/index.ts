import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { usePost } from '../use-post';
import { useIsPluginActive } from '../use-is-plugin-active';
import { useIsSupportedTaxonomy } from '../use-is-supported-taxonomy';
import { store as coreStore } from '@wordpress/core-data';
import type { WP_REST_API_Taxonomy } from 'wp-types';

export const usePrimaryTerm = (taxonomyName: string) => {
	const { postType, isEditable } = usePost();

	const [isYoastSeoActive, hasResolvedIsPluginActive] = useIsPluginActive('wordpress-seo/wp-seo');
	const [isSupportedTaxonomy, hasResolvedIsSupportedTaxonomy] = useIsSupportedTaxonomy(
		postType,
		taxonomyName,
	);

	const primaryTermId = useSelect(
		(select) => {
			if (!hasResolvedIsSupportedTaxonomy || !hasResolvedIsPluginActive) {
				return null;
			}

			if (!isYoastSeoActive && hasResolvedIsPluginActive) {
				// eslint-disable-next-line no-console
				console.error(
					'Yoast SEO is not active. Please install and activate Yoast SEO to use the PostPrimaryCategory component.',
				);
				return null;
			}

			if (!isSupportedTaxonomy && hasResolvedIsSupportedTaxonomy) {
				// eslint-disable-next-line no-console
				console.error(
					`The taxonomy "${taxonomyName}" is not supported for the post type "${postType}". Please use a supported taxonomy.`,
				);
				return null;
			}

			const yoastStore = select('yoast-seo/editor');

			if (!yoastStore) {
				// eslint-disable-next-line no-console
				console.error(`The yoast-seo/editor store does is not available.`);
				return null;
			}

			return select('yoast-seo/editor').getPrimaryTaxonomyId(taxonomyName);
		},
		[
			taxonomyName,
			isYoastSeoActive,
			isSupportedTaxonomy,
			hasResolvedIsSupportedTaxonomy,
			hasResolvedIsPluginActive,
		],
	);

	const primaryTerm = useSelect(
		(select) => {
			if (!primaryTermId) {
				return null;
			}

			const { getEntityRecord } = select(coreStore);
			return getEntityRecord<WP_REST_API_Taxonomy>('taxonomy', taxonomyName, primaryTermId);
		},
		[primaryTermId],
	);

	return [!isEditable ? { name: __('Primary Term', 'tenup') } : primaryTerm, isSupportedTaxonomy] as const;
};
