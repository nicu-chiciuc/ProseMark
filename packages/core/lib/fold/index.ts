import { bulletListExtension } from './bulletList';
import { emojiExtension } from './emoji';
import { htmlBlockExtension } from './htmlBlock';
import { imageExtension } from './image';
import { taskExtension } from './task';

export const defaultFoldableSyntaxExtensions = [
  bulletListExtension,
  taskExtension,
  imageExtension,
  emojiExtension,
  htmlBlockExtension,
];
