import isFinite from 'lodash/isFinite';
import filterComponentExamples from './filterComponentExamples';
import filterComponentsInSectionsByExactName from './filterComponentsInSectionsByExactName';
import filterSectionExamples from './filterSectionExamples';
import findSection from './findSection';
import getInfoFromHash from './getInfoFromHash';
import { DisplayModes } from '../consts';

/**
 * Returns the first element of the sections, which can be one of section or
 * component.
 *
 * @param {object} sections
 * @returns {object}
 */
const getFirstSectionOrComponent = sections => {
	const firstSection = sections[0];
	if (firstSection.components && firstSection.components.length > 0) {
		return { ...firstSection, components: [firstSection.components[0]] };
	}
	return firstSection;
};

/**
 * Return sections / components / examples to show on a screen according to a current route.
 *
 * Default: show all sections and components.
 * #!/Button: show only Button section or Button component
 * #!/Button/1: show only the second example (index 1) of Button component
 *
 * @param {object} sections
 * @param {string} hash
 * @param {boolean} pagePerSection
 * @returns {object}
 */
export default function getRouteData(sections, hash, pagePerSection) {
	// Parse URL hash to check if the components list must be filtered
	const infoFromHash = getInfoFromHash(hash, pagePerSection);

	// Name of the filtered component/section to show isolated (/#!/Button → Button)
	let { targetName } = infoFromHash;

	const {
		// Index of the fenced block example of the filtered component isolate (/#!/Button/1 → 1)
		targetIndex,
		tokens,
		isolate,
	} = infoFromHash;

	let displayMode = isolate ? DisplayModes.example : DisplayModes.all;

	if (targetName) {
		let filteredSections;
		if (pagePerSection) {
			let sectionDepth = 0;
			tokens.forEach((tokenName, index) => {
				filteredSections = filterComponentsInSectionsByExactName(sections, tokenName);
				if (filteredSections.length) {
					sections = filteredSections;
				} else {
					let section = findSection(sections, tokenName);
					if (section) {
						sectionDepth = section.sectionDepth ? section.sectionDepth : sectionDepth;
						const filterChildren = sectionDepth > index && !tokens[index + 1];
						if (filterChildren) {
							section = {
								...section,
								sections: [],
								components: [],
							};
						}
						sections = [section];
					} else {
						sections = [];
					}
				}
			});
			targetName = tokens[tokens.length - 1];
		} else {
			// Filter the requested component if required
			filteredSections = filterComponentsInSectionsByExactName(sections, targetName, true);
			if (filteredSections.length) {
				sections = filteredSections;
				displayMode = DisplayModes.component;
			} else {
				const section = findSection(sections, targetName);
				sections = section ? [section] : [];
				displayMode = DisplayModes.section;
			}
		}

		// If a single component or section is filtered and a fenced block index is specified hide all other examples
		if (isFinite(targetIndex)) {
			if (filteredSections.length === 1) {
				const filteredComponents = filteredSections[0].components;
				sections = [
					{
						...filteredSections[0],
						components: [filterComponentExamples(filteredComponents[0], targetIndex)],
					},
				];
				displayMode = DisplayModes.example;
			} else if (sections.length === 1) {
				sections = [filterSectionExamples(sections[0], targetIndex)];
				displayMode = DisplayModes.example;
			}
		}
	}

	return { sections, displayMode };
}
