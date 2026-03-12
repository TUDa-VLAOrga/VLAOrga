/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2026-03-09 20:20:43.

export interface LinusAppointment {
    id: number;
    linusUserId: number;
    orderTime?: Date;
    status: number;
    appointmentTime?: Date;
    comment?: string;
    name?: string;
}

export interface LinusAppointmentBuilder {
}

export interface LinusExperiment {
    id: number;
    categoryId: number;
    name: string;
    description?: string;
    comment?: string;
    preparationTime?: number;
    status: string;
    executionTime?: number;
    safetySigns?: string;
    experimentNumber: number;
}

export interface LinusExperimentBuilder {
}

export interface LinusExperimentBooking {
    id: number;
    linusAppointmentId?: number;
    linusExperimentId: number;
    linusUserId: number;
    status: number;
    pinnedOn?: Date;
}

export interface LinusExperimentBookingBuilder {
}

export interface LinusUser {
    id: number;
    name: string;
    roles: string;
    password: string;
    email: string;
}

export interface Acceptance {
    id: number;
    appointment: Appointment;
    startTime: Date;
    endTime: Date;
}

export interface AcceptanceBuilder {
}

export interface Appointment {
    id: number;
    series: AppointmentSeries;
    startTime: Date;
    endTime: Date;
    notes: string;
    bookings: ExperimentBooking[];
    deletingIntentionUser?: User;
}

export interface AppointmentBuilder {
}

export interface AppointmentCategory {
    id: number;
    title: string;
}

export interface AppointmentCategoryBuilder {
}

export interface AppointmentMatching {
    id: number;
    linusAppointmentId: number;
    linusAppointmentTime: Date;
    appointment?: Appointment;
}

export interface AppointmentMatchingBuilder {
}

export interface AppointmentSeries {
    id: number;
    lecture?: Lecture;
    name: string;
    category: AppointmentCategory;
}

export interface AppointmentSeriesBuilder {
}

export interface ExperimentBooking {
    id: number;
    linusExperimentId: number;
    linusExperimentBookingId?: number;
    person?: Person;
    notes: string;
    status: ExperimentPreparationStatus;
}

export interface ExperimentBookingBuilder {
}

export interface GlobalNote {
    id: number;
    color: string;
    title: string;
    content: string;
}

export interface Lecture {
    id: number;
    name: string;
    semester: string;
    color: string;
    persons: Person[];
}

export interface LectureBuilder {
}

export interface Person {
    id: number;
    name: string;
    email: string;
    notes: string;
    linusUserId?: number;
    linusUsername?: string;
}

export interface PersonBuilder {
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface UserBuilder {
}

export interface TimeFrame {
    commence: Date;
    terminate: Date;
}

export interface TimeFrameBuilder {
}

export enum ExperimentPreparationStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
}

export enum SseMessageType {
    SSEDEBUG = "SSEDEBUG",
    GLOBALNOTECREATED = "GLOBALNOTECREATED",
    GLOBALNOTEUPDATED = "GLOBALNOTEUPDATED",
    GLOBALNOTEDELETED = "GLOBALNOTEDELETED",
    APPOINTMENTMATCHINGCREATE = "APPOINTMENTMATCHINGCREATE",
    APPOINTMENTMATCHINGUPDATE = "APPOINTMENTMATCHINGUPDATE",
    APPOINTMENTCATEGORYCREATED = "APPOINTMENTCATEGORYCREATED",
    APPOINTMENTCATEGORYUPDATED = "APPOINTMENTCATEGORYUPDATED",
    APPOINTMENTCATEGORYDELETED = "APPOINTMENTCATEGORYDELETED",
    PERSONCREATED = "PERSONCREATED",
    PERSONUPDATED = "PERSONUPDATED",
    PERSONDELETED = "PERSONDELETED",
    LECTURECREATED = "LECTURECREATED",
    LECTUREUPDATED = "LECTUREUPDATED",
    LECTUREDELETED = "LECTUREDELETED",
    APPOINTMENTSERIESCREATED = "APPOINTMENTSERIESCREATED",
    APPOINTMENTSERIESUPDATED = "APPOINTMENTSERIESUPDATED",
    APPOINTMENTSERIESDELETED = "APPOINTMENTSERIESDELETED",
    APPOINTMENTCREATED = "APPOINTMENTCREATED",
    APPOINTMENTUPDATED = "APPOINTMENTUPDATED",
    APPOINTMENTDELETED = "APPOINTMENTDELETED",
    ACCEPTANCECREATED = "ACCEPTANCECREATED",
    ACCEPTANCEUPDATED = "ACCEPTANCEUPDATED",
    ACCEPTANCEDELETED = "ACCEPTANCEDELETED",
    LINUSBOOKINGSIMPORT = "LINUSBOOKINGSIMPORT",
    EXPERIMENTBOOKINGUPDATED = "EXPERIMENTBOOKINGUPDATED",
    DEBUG = "DEBUG",
}
