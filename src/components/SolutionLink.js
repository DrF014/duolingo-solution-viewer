import { h } from 'preact';
import { IntlProvider, Text } from 'preact-i18n';
import { StyleSheet } from 'aphrodite';
import moize from 'moize';
import { CONTEXT_CHALLENGE, CONTEXT_FORUM, useStyles } from './base';
import Loader from './Loader';
import { RESULT_CORRECT, RESULT_INCORRECT, DEFAULT_RESULT_COLORS, RESULT_NONE } from '../constants';

import {
  discardEvent,
  getSolutionsI18nCounts,
  getSolutionIconCssUrl,
  getStylesByClassNames,
} from '../functions';

const SolutionLink =
  ({
     context = CONTEXT_CHALLENGE,
     result = RESULT_NONE,
     isLoading = false,
     solutions = [],
     onClick = discardEvent,
   }) => {
    const STYLE_SHEETS = Object.assign({}, BASE_STYLE_SHEETS, (CONTEXT_FORUM === context)
      ? {}
      : {
        [RESULT_CORRECT]: getChallengeResultStyleSheet(RESULT_CORRECT),
        [RESULT_INCORRECT]: getChallengeResultStyleSheet(RESULT_INCORRECT),
      }
    );

    const getElementClassNames = useStyles(CLASS_NAMES, STYLE_SHEETS, [ context, result ]);

    if (!isLoading && (0 === solutions.length)) {
      return null;
    }

    const counts = getSolutionsI18nCounts(solutions);

    return (
      <IntlProvider scope="solution_link">
        {isLoading ? (
          <div className={getElementClassNames(WRAPPER)}>
            <Loader />
          </div>
        ) : (
          <a className={getElementClassNames(WRAPPER)} onClick={onClick}>
            <div className={getElementClassNames(ICON)} />
            <span className={getElementClassNames(TITLE)}>
              <Text id="label" plural={counts.plural} fields={{ count: counts.display }}>
                Solutions ({counts.display})
              </Text>
            </span>
          </a>
        )}
      </IntlProvider>
    );
  };

export default SolutionLink;

const WRAPPER = 'wrapper';
const ICON = 'icon';
const TITLE = 'title';

const CLASS_NAMES = {
  [CONTEXT_CHALLENGE]: {
    [WRAPPER]: [ '_2KzUW' ],
    [ICON]: [ '_2wZWI' ],
    [TITLE]: [ '_1kYcS', '_1BWZU' ]
  },
  [CONTEXT_FORUM]: {
    [WRAPPER]: [ '_5j_V-' ],
    [TITLE]: [ 'uFNEM', 'tCqcy' ],
  },
  [RESULT_CORRECT]: {
    [WRAPPER]: [ '_11OI0' ],
    [ICON]: [ '_1vlYi' ],
  },
  [RESULT_INCORRECT]: {
    [WRAPPER]: [ '_1uM9m' ],
    [ICON]: [ '_1uM9m' ],
  },
};

const BASE_STYLE_SHEETS = {
  [CONTEXT_FORUM]: StyleSheet.create({
    [WRAPPER]: {
      cursor: 'pointer',
      float: 'right',
      marginTop: '2px',
      userSelect: 'none',
    },
  }),
};

/**
 * @function
 * @param {string} result A result type.
 * @returns {object} The corresponding stylesheet applicable on a challenge page.
 */
const getChallengeResultStyleSheet = moize(
  result => {
    const iconStyles = getStylesByClassNames(
      CLASS_NAMES[CONTEXT_CHALLENGE][ICON].concat(CLASS_NAMES[result][ICON] || []),
      [
        'background-image',
        'background-origin',
        'background-position',
        'background-repeat',
        'background-size',
      ]
    );

    const wrapperStyles = getStylesByClassNames(
      CLASS_NAMES[CONTEXT_CHALLENGE][WRAPPER].concat(CLASS_NAMES[result][WRAPPER] || []),
      [ 'color' ]
    );

    return StyleSheet.create({
      [ICON]: {
        backgroundColor: wrapperStyles['color'] || DEFAULT_RESULT_COLORS[result] || '',
        maskImage: getSolutionIconCssUrl() || '',
        maskOrigin: iconStyles['background-origin'],
        maskPosition: iconStyles['background-position'],
        maskRepeat: iconStyles['background-repeat'],
        maskSize: iconStyles['background-size'],
      }
    });
  }
);