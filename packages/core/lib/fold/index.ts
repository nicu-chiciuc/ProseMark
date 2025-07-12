import { bulletListExtension } from './bulletList';
import { emojiExtension } from './emoji';
import { horizonalRuleExtension } from './horizontalRule';
import { imageExtension } from './image';
import { taskExtension } from './task';

export const defaultFoldableSyntaxExtensions = [
  bulletListExtension,
  taskExtension,
  imageExtension,
  emojiExtension,
  horizonalRuleExtension,
];
