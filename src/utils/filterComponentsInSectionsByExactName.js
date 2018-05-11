import filterComponentsByExactName from './filterComponentsByExactName';

/**
 * Recursively filters all components in all sections by component name.
 *
 * @param {object} sections
 * @param {string} name
 * @param {boolean} deep
 * @return {Array}
 */
export default function filterComponentsInSectionsByExactName(sections, name, deep) {
	const filteredSections = [];
	sections.forEach(section => {
		if (section.components) {
			const filteredComponents = filterComponentsByExactName(section.components, name);
			if (filteredComponents.length) {
				filteredSections.push({
					codeSamples: section.codeSamples,
					propsMethods: section.propsMethods,
					components: filteredComponents,
				});
			}
		}
		if (section.sections && deep) {
			filteredSections.push(...filterComponentsInSectionsByExactName(section.sections, name));
		}
	});
	return filteredSections;
}
