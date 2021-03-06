import { Dirent, readFileSync, readdirSync } from 'fs';
import { basename, dirname, extname, join, parse } from 'path';

/**
 * Return a boolean indicating that given dirent is a file or not.
 *
 * @param dirent The dirent object
 * @return A boolean indicating that the dirent name matches the text
 */
export function direntIsFile(dirent: Dirent): boolean {
  return dirent.isFile();
}

/**
 * Return a boolean indicating that the dirent name includes the text.
 *
 * @param text The text to match
 * @param dirent The dirent object
 * @return A boolean indicating that the dirent name includes the text
 */
export function direntIncludes(text: string, dirent: Dirent): boolean {
  return parse(dirent.name).name === text;
}

/**
 * Read the file and parse its content as json.
 *
 * @param path The file path
 * @return The file content
 */
export function readJSONFileSync(path: string): any {
  return JSON.parse(readFileSync(path).toString());
}

/**
 * Read the fixture file.
 *
 * @param path The fixture path
 * @return The fixture content
 */
export function readFixtureFileSync(path: string): any {
  if (extname(path) === '.json') {
    return readJSONFileSync(path);
  }

  return readFileSync(path);
}

/**
 * Read the first fixture file using path's dirname that matches the path's basename.
 *
 * @param path The file path
 * @return The file content
 */
export function readFixturePathSync(path: string): any {
  const folder = dirname(path);
  const file = basename(path);

  const directory = join('data', folder);

  const direntIncludesFilename = direntIncludes.bind(null, file);

  const [fixture] = readdirSync(directory, { withFileTypes: true })
    .filter(direntIsFile)
    .filter(direntIncludesFilename);

  return readFixtureFileSync(join(directory, fixture.name));
}

/**
 * Read a fixture file using the extension when available or by reading the whole directory.
 *
 * @param path The file path
 * @param fallbackPath The fallback file path
 * @return The file content.
 */
export function readFixtureSync(path: string, fallbackPath?: string): any {
  const extension = extname(path);

  try {
    return extension ? readFixtureFileSync(path) : readFixturePathSync(path);
  } catch (error) {
    if (fallbackPath) {
      try {
        return readFixturePathSync(fallbackPath);
      } catch (fallbackError) {
        console.error(
          'You probably forgot to create the fallback fixture file',
          fallbackPath,
          fallbackError
        );
      }
    } else {
      console.error(
        'You probably forgot to create the fixture file.',
        path,
        error
      );
    }
  }
}
