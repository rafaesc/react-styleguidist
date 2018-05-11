import React from 'react';
import ComponentsListRenderer from 'rsg-components/ComponentsList/ComponentsListRenderer';
import PropTypes from 'prop-types';
import getUrl from '../../utils/getUrl';

function ComponentsList({ classes, items, useRouterLinks = false, pathName }) {
	const mappedItems = items.map(item => ({
		...item,
		href: getUrl({
			name: item.name,
			slug: item.slug,
			anchor: !useRouterLinks,
			pathName: [...pathName, item.name],
			router: useRouterLinks,
		}),
	}));
	return <ComponentsListRenderer classes={classes} items={mappedItems} />;
}

ComponentsList.propTypes = {
	items: PropTypes.array.isRequired,
	classes: PropTypes.object,
	pathName: PropTypes.array,
	useRouterLinks: PropTypes.bool,
};

export default ComponentsList;
