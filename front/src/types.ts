export interface AuthState {
  userIsAutharized: boolean | null;
  userInfo?: User;
}

export interface CategoryState {
  isFetched: boolean;
  categories: Category[];
}

export interface EventState {
  isFetched: boolean;
  events: Event[];
}

export interface ServiState {
  isFetched: boolean;
  servis: Servi[];
}

export enum UserRole {
  BASIC = 'BASIC',
  ADMIN = 'ADMIN',
}

export interface User {
  token: string;
  id?: number;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;
  fieldOfStudy: string;
  events: Array<DoneEvent>;
  capWithTF: boolean;
}

export interface NewUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fieldOfStudy: string;
  otherFieldOfStudy: string | undefined;
  capWithTF: boolean;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  startTime: luxon.DateTime;
  endTime: luxon.DateTime;
  points?: number;
  userLimit?: number;
  categoryId: number;
  mandatory: boolean;
}

export type NewEvent = Omit<Event, 'id'>;

export interface Servi {
  id: number;
  name: string;
  description: string;
  startTime: luxon.DateTime;
  endTime: luxon.DateTime;
  points: number;
  userLimit?: number;
}

export type NewServi = Omit<Servi, 'id'>;

export interface Category {
  id: number;
  name: string;
  description: string;
  minPoints: number | null;
  events: Event[];
}

export enum EventStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface DoneEvent {
  id: number;
  status: EventStatus;
  timeOfSignup: Date;
  timeOfCompletion: Date;
  eventID: number;
  userID: number;
}

export type CombinedEvent = DoneEvent & Event;

export enum Routes {
  ROOT = '/',
  START = '/start',
  LOGIN = '/login',
  SIGNUP = '/signup',
  CATEGORY = '/kategori',
  EVENT_GENERATION = '/poang/generate',
  SPECIFIC_EVENT_GENERATION = '/poang/generate/:eventId',
  EVENT_VALIDATION = '/poang/validation/:hash',
  SPECIFIC_CATEGORY = '/kategori/:categoryId',
  ADMIN = '/admin',
  ADMIN_REQUESTS = '/admin/requests',
  ADMIN_ADDMORE = '/admin/addmore',
  ADMIN_SUMMARY = '/admin/summary',
  USER_SETTINGS = '/settings',
  INSTRUCTIONS = '/reglemente',
}

export enum FieldOfStudy {
  ARK = 'Arkitektur',
  AS = 'Automations- och informationsteknologi',
  BILDKONST = 'Bildkonstpedagogik',
  BIO = 'Bioinformationsteknologi',
  DATA = 'Datateknik',
  RYM = 'Den byggda miljön',
  DESIGN = 'Design',
  SCENKONST = 'Design för scenkonst',
  DOKUFILM = 'Dokumentärfilm',
  EL = 'Elektronik och elektroteknik',
  ENERGI = 'Energi- och miljöteknik',
  FILMKLIPP = 'Filmklippning',
  LJUD = 'Filmljudinspelning och -ljudplanering',
  FILM = 'Filmning',
  SKRIPT = 'Film- och tv-manuskript',
  PRODUKTION = 'Film- och tv-produktion',
  SCENOGRAFI = 'Film- och tv-scenografi',
  REGI = 'Filmregi',
  INFO = 'Informationsnätverk',
  INREDNING = 'Inredningsarkitektur',
  KAUPPIS = 'Kauppatieteiden kandidaattiohjelma',
  KEMI = 'Kemiteknik',
  KOSTYMDESIGN = 'Kostymdesign',
  LANDSKAPSARK = 'Landskapsarkitektur',
  MASKIN = 'Maskin- och byggnadsteknik',
  MODE = 'Mode',
  PRODEKO = 'Produktionsekonomi',
  TFM = 'Teknisk fysik och matematik',
  KOMMUNIKATIONDESIGN = 'Visuell kommunikation och design',
  OTHER = 'Annat, vad?',
}
