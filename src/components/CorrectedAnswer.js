import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { IntlProvider, Text } from 'preact-i18n';
import { StyleSheet } from 'aphrodite';
import { _ } from 'param.macro';
import { BASE, useStyles } from './base';
import { RESULT_CORRECT, RESULT_INCORRECT } from '../constants';

const WRAPPER = 'wrapper';
const VALUE = 'value';
const ADDED_TOKEN = 'added_token';
const REMOVED_TOKEN = 'removed_token';

const CLASS_NAMES = {
  [BASE]: {
    [WRAPPER]: [ '_36Uyg' ],
    [VALUE]: [ 'TnCw3' ],
  },
  [RESULT_CORRECT]: {
    [WRAPPER]: [ '_11xjL ' ],
    [ADDED_TOKEN]: [ '_2QxbX' ],
  },
  [RESULT_INCORRECT]: {
    [WRAPPER]: [ '_2QxbX' ],
  },
};

const STYLE_SHEETS = {
  [BASE]: StyleSheet.create({
    [WRAPPER]: {
      marginBottom: '10px',
    },
    [REMOVED_TOKEN]: {
      textDecoration: 'underline',
    },
  }),
};

const DISPLAY_MODE_ORIGINAL = 'original';
const DISPLAY_MODE_CORRECTED = 'corrected';

const CorrectedAnswer = ({ diffTokens = [], result = RESULT_CORRECT }) => {
  const getElementClassNames = useStyles(CLASS_NAMES, STYLE_SHEETS, [ result ]);

  const renderToken = useCallback((token, displayMode) => {
    let elementKey = null;

    if (token.added) {
      if (DISPLAY_MODE_CORRECTED === displayMode) {
        return null;
      } else if (!token.ignorable) {
        elementKey = ADDED_TOKEN;
      }
    } else if (token.removed) {
      if (DISPLAY_MODE_ORIGINAL === displayMode) {
        return null;
      } else if (!token.ignorable) {
        elementKey = REMOVED_TOKEN;
      }
    }

    return <span className={elementKey && getElementClassNames(elementKey)}>{token.value}</span>;
  }, [ getElementClassNames ]);

  const [ originalAnswer, setOriginalAnswer ] = useState([]);
  const [ correctedAnswer, setCorrectedAnswer ] = useState([]);

  useEffect(() => {
    setOriginalAnswer(diffTokens.map(renderToken(_, DISPLAY_MODE_ORIGINAL)));
    setCorrectedAnswer(diffTokens.map(renderToken(_, DISPLAY_MODE_CORRECTED)));
  }, [ diffTokens, renderToken ]);

  if (0 === diffTokens.length) {
    return null;
  }

  return (
    <IntlProvider scope="solution.result">
      <h2 className={getElementClassNames(WRAPPER)}>
        <Text id="corrected_answer">Corrected answer:</Text>
        <div className={getElementClassNames(VALUE)}>
          {originalAnswer}
        </div>
        <div className={getElementClassNames(VALUE)}>
          {correctedAnswer}
        </div>
      </h2>
    </IntlProvider>
  );
}

export default CorrectedAnswer;
