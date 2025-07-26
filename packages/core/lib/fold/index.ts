import { bulletListExtension } from './bulletList';
import { emojiExtension } from './emoji';
import { horizonalRuleExtension } from './horizontalRule';
import { imageExtension } from './image';
import { taskExtension } from './task';
import { blockQuoteExtension } from './blockQuote';

export const defaultFoldableSyntaxExtensions = [
  blockQuoteExtension,
  bulletListExtension,
  taskExtension,
  imageExtension,
  emojiExtension,
  horizonalRuleExtension,
];
