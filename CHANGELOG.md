# Changelog

All major changes to the project will be noted here

## 2.2.0
### Added
- Strict mode
### Changed
- Default behavior will now follow `strict` mode, treating the `config` as source of truth
- Strict mode will ignore any version/force overrides for `require` calls

## 2.1.2
### Added
- Having default for config options

## 2.1.1
### Added
- Allowing config to have single version or array of versions for each dependency

## 2.1.0
### Added
- Ability to require sub-paths via `requirey`

## 2.0.1 
### Added 
- Appveyor tests to ensure windows support

## 2.0.0
### Removed
- Made the `satisfier` method private

## 1.0.1
### Removed
- `shelljs` from devDependency (was unused)

## 1.0.0
### Added
- `installAll`, `install` and `Requirer` interfaces