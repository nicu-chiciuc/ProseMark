import { bulletListExtension } from './bulletList';
import { emojiExtension } from './emoji';
import { horizonalRuleExtension } from './horizontalRule';
import { htmlBlockExtension } from './html';
import { imageExtension } from './image';
import { taskExtension } from './task';

export const defaultFoldableSyntaxExtensions = [
  bulletListExtension,
  taskExtension,
  imageExtension,
  emojiExtension,
  htmlBlockExtension,
  horizonalRuleExtension,
];
