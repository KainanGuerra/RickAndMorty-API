export type Locale = 'en' | 'pt';

interface PageParams {
  page: number;
  totalPages: number;
}

interface CountParams {
  total: number;
}

interface EpisodeNotFoundParams {
  number: string;
}

export interface TranslationKeys {
  // ThemeToggle
  switchToLightMode: string;
  switchToDarkMode: string;

  // LocaleToggle
  switchToPortuguese: string;
  switchToEnglish: string;

  // HeaderMenu
  apiDocs: string;
  logout: string;
  loggingOut: string;

  // Footer
  footerGitHub: string;
  footerRickAndMortyApi: string;

  // LoginForm / login page
  emailPlaceholder: string;
  passwordPlaceholder: string;
  logIn: string;
  register: string;
  needAnAccount: string;
  haveAnAccount: string;
  showPassword: string;
  hidePassword: string;
  registerSuccess: string;
  somethingWentWrong: string;
  couldNotReachServer: string;
  invalidCredentials: string;
  emailAlreadyRegistered: string;
  invalidEmailFormat: string;
  passwordPolicyError: string;
  passwordReqLength: string;
  passwordReqUppercase: string;
  passwordReqLowercase: string;
  passwordReqDigit: string;
  passwordReqSpecial: string;

  // Sidebar
  sidebarTitle: string;
  episodeNumberLabel: string;
  episodeNumberAriaLabel: string;
  episodeNumberPlaceholder: string;
  nameFilterLabel: string;
  nameFilterAriaLabel: string;
  nameFilterPlaceholder: string;
  sortLabel: string;
  sortAriaLabel: string;
  sortAsc: string;
  sortDesc: string;
  perPageLabel: string;
  perPageAriaLabel: string;
  search: string;
  searching: string;

  // EpisodeSearch
  pageTitle: string;
  couldNotLoadCharacters: string;
  episodeNotFoundError: (params: EpisodeNotFoundParams) => string;

  // EpisodeResults
  loading: string;
  noCharactersFound: string;
  enterEpisodePrompt: string;
  previous: string;
  next: string;
  pagination: string;
  pageStatus: (params: PageParams) => string;
  resultsCount: (params: CountParams) => string;
}

export const translations: Record<Locale, TranslationKeys> = {
  en: {
    switchToLightMode: 'Switch to light mode',
    switchToDarkMode: 'Switch to dark mode',

    switchToPortuguese: 'Switch to Portuguese',
    switchToEnglish: 'Switch to English',

    apiDocs: 'API docs',
    logout: 'Logout',
    loggingOut: 'Logging out…',

    footerGitHub: 'GitHub',
    footerRickAndMortyApi: 'Rick and Morty API',

    emailPlaceholder: 'email',
    passwordPlaceholder: 'password',
    logIn: 'Log in',
    register: 'Register',
    needAnAccount: "Don't have an account? Register",
    haveAnAccount: 'Already have an account? Log in',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    registerSuccess: 'Account created — you can log in now.',
    somethingWentWrong: 'Something went wrong',
    couldNotReachServer: 'Could not reach the server',
    invalidCredentials: 'Invalid credentials',
    emailAlreadyRegistered: 'Email is already registered',
    invalidEmailFormat: 'Enter a valid email address',
    passwordPolicyError:
      'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a digit, and a special character',
    passwordReqLength: 'At least 8 characters',
    passwordReqUppercase: 'One uppercase letter',
    passwordReqLowercase: 'One lowercase letter',
    passwordReqDigit: 'One digit',
    passwordReqSpecial: 'One special character',

    sidebarTitle: 'Search',
    episodeNumberLabel: 'Episode number',
    episodeNumberAriaLabel: 'episode number',
    episodeNumberPlaceholder: 'e.g. 1',
    nameFilterLabel: 'Filter by name (contains)',
    nameFilterAriaLabel: 'name filter',
    nameFilterPlaceholder: 'e.g. rick',
    sortLabel: 'Sort',
    sortAriaLabel: 'sort order',
    sortAsc: 'A → Z',
    sortDesc: 'Z → A',
    perPageLabel: 'Per page',
    perPageAriaLabel: 'results per page',
    search: 'Search',
    searching: 'Searching…',

    pageTitle: 'Rick and Morty — episode characters',
    couldNotLoadCharacters: 'Could not load characters',
    episodeNotFoundError: ({ number }) => `Episode ${number} was not found`,

    loading: 'Loading…',
    noCharactersFound: 'No characters found.',
    enterEpisodePrompt: 'Enter an episode number to see its characters.',
    previous: 'Previous',
    next: 'Next',
    pagination: 'Pagination',
    pageStatus: ({ page, totalPages }) => `Page ${page} of ${totalPages}`,
    resultsCount: ({ total }) => `${total} character${total === 1 ? '' : 's'}`,
  },
  pt: {
    switchToLightMode: 'Mudar para o modo claro',
    switchToDarkMode: 'Mudar para o modo escuro',

    switchToPortuguese: 'Mudar para português',
    switchToEnglish: 'Switch to English',

    apiDocs: 'Documentação da API',
    logout: 'Sair',
    loggingOut: 'Saindo…',

    footerGitHub: 'GitHub',
    footerRickAndMortyApi: 'Rick and Morty API',

    emailPlaceholder: 'email',
    passwordPlaceholder: 'senha',
    logIn: 'Entrar',
    register: 'Cadastrar',
    needAnAccount: 'Não tem uma conta? Cadastre-se',
    haveAnAccount: 'Já tem uma conta? Entrar',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    registerSuccess: 'Conta criada — você já pode entrar.',
    somethingWentWrong: 'Algo deu errado',
    couldNotReachServer: 'Não foi possível conectar ao servidor',
    invalidCredentials: 'Credenciais inválidas',
    emailAlreadyRegistered: 'Este email já está cadastrado',
    invalidEmailFormat: 'Informe um email válido',
    passwordPolicyError:
      'A senha deve ter pelo menos 8 caracteres e incluir uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial',
    passwordReqLength: 'Pelo menos 8 caracteres',
    passwordReqUppercase: 'Uma letra maiúscula',
    passwordReqLowercase: 'Uma letra minúscula',
    passwordReqDigit: 'Um dígito',
    passwordReqSpecial: 'Um caractere especial',

    sidebarTitle: 'Buscar',
    episodeNumberLabel: 'Número do episódio',
    episodeNumberAriaLabel: 'número do episódio',
    episodeNumberPlaceholder: 'ex.: 1',
    nameFilterLabel: 'Filtrar por nome (contém)',
    nameFilterAriaLabel: 'filtro de nome',
    nameFilterPlaceholder: 'ex.: rick',
    sortLabel: 'Ordenar',
    sortAriaLabel: 'ordem de classificação',
    sortAsc: 'A → Z',
    sortDesc: 'Z → A',
    perPageLabel: 'Por página',
    perPageAriaLabel: 'resultados por página',
    search: 'Buscar',
    searching: 'Buscando…',

    pageTitle: 'Rick and Morty — personagens por episódio',
    couldNotLoadCharacters: 'Não foi possível carregar os personagens',
    episodeNotFoundError: ({ number }) => `Episódio ${number} não foi encontrado`,

    loading: 'Carregando…',
    noCharactersFound: 'Nenhum personagem encontrado.',
    enterEpisodePrompt: 'Informe um número de episódio para ver seus personagens.',
    previous: 'Anterior',
    next: 'Próxima',
    pagination: 'Paginação',
    pageStatus: ({ page, totalPages }) => `Página ${page} de ${totalPages}`,
    resultsCount: ({ total }) => `${total} personagem${total === 1 ? '' : 's'}`,
  },
};
