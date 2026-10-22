export { exampleThemes as studioThemes } from '../examples/theme';

// The showcase owns this palette; consuming projects keep their own theme choices.
export const studioAccents = [
  { label: '올리브', value: '#68783e', ink: '#ffffff' },
  { label: '연두', value: '#99b44a', ink: '#263314' },
  { label: '포레스트', value: '#3d775b', ink: '#ffffff' },
  { label: '세이지', value: '#7e9571', ink: '#18250f' },
] as const;
