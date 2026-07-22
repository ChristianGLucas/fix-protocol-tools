// package: christiangeorgelucas.fix_protocol_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class FixField extends jspb.Message {
  getTag(): number;
  setTag(value: number): void;

  getValue(): string;
  setValue(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FixField.AsObject;
  static toObject(includeInstance: boolean, msg: FixField): FixField.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FixField, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FixField;
  static deserializeBinaryFromReader(message: FixField, reader: jspb.BinaryReader): FixField;
}

export namespace FixField {
  export type AsObject = {
    tag: number,
    value: string,
    name: string,
  }
}

export class RawFixMessage extends jspb.Message {
  getRaw(): string;
  setRaw(value: string): void;

  getDelimiter(): string;
  setDelimiter(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RawFixMessage.AsObject;
  static toObject(includeInstance: boolean, msg: RawFixMessage): RawFixMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RawFixMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RawFixMessage;
  static deserializeBinaryFromReader(message: RawFixMessage, reader: jspb.BinaryReader): RawFixMessage;
}

export namespace RawFixMessage {
  export type AsObject = {
    raw: string,
    delimiter: string,
  }
}

export class FieldListOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearFieldsList(): void;
  getFieldsList(): Array<FixField>;
  setFieldsList(value: Array<FixField>): void;
  addFields(value?: FixField, index?: number): FixField;

  getDelimiterUsed(): string;
  setDelimiterUsed(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FieldListOutput.AsObject;
  static toObject(includeInstance: boolean, msg: FieldListOutput): FieldListOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FieldListOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FieldListOutput;
  static deserializeBinaryFromReader(message: FieldListOutput, reader: jspb.BinaryReader): FieldListOutput;
}

export namespace FieldListOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    fieldsList: Array<FixField.AsObject>,
    delimiterUsed: string,
  }
}

export class FieldMapOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getFieldsMap(): jspb.Map<string, string>;
  clearFieldsMap(): void;
  clearDuplicateTagsList(): void;
  getDuplicateTagsList(): Array<number>;
  setDuplicateTagsList(value: Array<number>): void;
  addDuplicateTags(value: number, index?: number): number;

  getDelimiterUsed(): string;
  setDelimiterUsed(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FieldMapOutput.AsObject;
  static toObject(includeInstance: boolean, msg: FieldMapOutput): FieldMapOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FieldMapOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FieldMapOutput;
  static deserializeBinaryFromReader(message: FieldMapOutput, reader: jspb.BinaryReader): FieldMapOutput;
}

export namespace FieldMapOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    fieldsMap: Array<[string, string]>,
    duplicateTagsList: Array<number>,
    delimiterUsed: string,
  }
}

export class GetFieldByTagInput extends jspb.Message {
  getRaw(): string;
  setRaw(value: string): void;

  getDelimiter(): string;
  setDelimiter(value: string): void;

  getTag(): number;
  setTag(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFieldByTagInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetFieldByTagInput): GetFieldByTagInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetFieldByTagInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFieldByTagInput;
  static deserializeBinaryFromReader(message: GetFieldByTagInput, reader: jspb.BinaryReader): GetFieldByTagInput;
}

export namespace GetFieldByTagInput {
  export type AsObject = {
    raw: string,
    delimiter: string,
    tag: number,
  }
}

export class GetFieldByNameInput extends jspb.Message {
  getRaw(): string;
  setRaw(value: string): void;

  getDelimiter(): string;
  setDelimiter(value: string): void;

  getFieldName(): string;
  setFieldName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFieldByNameInput.AsObject;
  static toObject(includeInstance: boolean, msg: GetFieldByNameInput): GetFieldByNameInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetFieldByNameInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFieldByNameInput;
  static deserializeBinaryFromReader(message: GetFieldByNameInput, reader: jspb.BinaryReader): GetFieldByNameInput;
}

export namespace GetFieldByNameInput {
  export type AsObject = {
    raw: string,
    delimiter: string,
    fieldName: string,
  }
}

export class FieldValueOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getFound(): boolean;
  setFound(value: boolean): void;

  getTag(): number;
  setTag(value: number): void;

  getValue(): string;
  setValue(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FieldValueOutput.AsObject;
  static toObject(includeInstance: boolean, msg: FieldValueOutput): FieldValueOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FieldValueOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FieldValueOutput;
  static deserializeBinaryFromReader(message: FieldValueOutput, reader: jspb.BinaryReader): FieldValueOutput;
}

export namespace FieldValueOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    found: boolean,
    tag: number,
    value: string,
    name: string,
  }
}

export class DecodedMessageOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearFieldsList(): void;
  getFieldsList(): Array<FixField>;
  setFieldsList(value: Array<FixField>): void;
  addFields(value?: FixField, index?: number): FixField;

  getMsgType(): string;
  setMsgType(value: string): void;

  getMsgTypeName(): string;
  setMsgTypeName(value: string): void;

  getDelimiterUsed(): string;
  setDelimiterUsed(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DecodedMessageOutput.AsObject;
  static toObject(includeInstance: boolean, msg: DecodedMessageOutput): DecodedMessageOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DecodedMessageOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DecodedMessageOutput;
  static deserializeBinaryFromReader(message: DecodedMessageOutput, reader: jspb.BinaryReader): DecodedMessageOutput;
}

export namespace DecodedMessageOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    fieldsList: Array<FixField.AsObject>,
    msgType: string,
    msgTypeName: string,
    delimiterUsed: string,
  }
}

export class MsgTypeOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getFound(): boolean;
  setFound(value: boolean): void;

  getMsgType(): string;
  setMsgType(value: string): void;

  getMsgTypeName(): string;
  setMsgTypeName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgTypeOutput.AsObject;
  static toObject(includeInstance: boolean, msg: MsgTypeOutput): MsgTypeOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MsgTypeOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgTypeOutput;
  static deserializeBinaryFromReader(message: MsgTypeOutput, reader: jspb.BinaryReader): MsgTypeOutput;
}

export namespace MsgTypeOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    found: boolean,
    msgType: string,
    msgTypeName: string,
  }
}

export class HeaderFieldsOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getBeginString(): string;
  setBeginString(value: string): void;

  getBodyLength(): number;
  setBodyLength(value: number): void;

  getMsgType(): string;
  setMsgType(value: string): void;

  getMsgTypeName(): string;
  setMsgTypeName(value: string): void;

  getSenderCompId(): string;
  setSenderCompId(value: string): void;

  getTargetCompId(): string;
  setTargetCompId(value: string): void;

  getMsgSeqNum(): number;
  setMsgSeqNum(value: number): void;

  getSendingTime(): string;
  setSendingTime(value: string): void;

  clearMissingFieldsList(): void;
  getMissingFieldsList(): Array<number>;
  setMissingFieldsList(value: Array<number>): void;
  addMissingFields(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HeaderFieldsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: HeaderFieldsOutput): HeaderFieldsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HeaderFieldsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HeaderFieldsOutput;
  static deserializeBinaryFromReader(message: HeaderFieldsOutput, reader: jspb.BinaryReader): HeaderFieldsOutput;
}

export namespace HeaderFieldsOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    beginString: string,
    bodyLength: number,
    msgType: string,
    msgTypeName: string,
    senderCompId: string,
    targetCompId: string,
    msgSeqNum: number,
    sendingTime: string,
    missingFieldsList: Array<number>,
  }
}

export class OrderFieldsOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getSymbol(): string;
  setSymbol(value: string): void;

  getSide(): string;
  setSide(value: string): void;

  getSideName(): string;
  setSideName(value: string): void;

  getOrderQty(): string;
  setOrderQty(value: string): void;

  getPrice(): string;
  setPrice(value: string): void;

  getOrdType(): string;
  setOrdType(value: string): void;

  getOrdTypeName(): string;
  setOrdTypeName(value: string): void;

  getTimeInForce(): string;
  setTimeInForce(value: string): void;

  getTimeInForceName(): string;
  setTimeInForceName(value: string): void;

  clearMissingFieldsList(): void;
  getMissingFieldsList(): Array<number>;
  setMissingFieldsList(value: Array<number>): void;
  addMissingFields(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OrderFieldsOutput.AsObject;
  static toObject(includeInstance: boolean, msg: OrderFieldsOutput): OrderFieldsOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OrderFieldsOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OrderFieldsOutput;
  static deserializeBinaryFromReader(message: OrderFieldsOutput, reader: jspb.BinaryReader): OrderFieldsOutput;
}

export namespace OrderFieldsOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    symbol: string,
    side: string,
    sideName: string,
    orderQty: string,
    price: string,
    ordType: string,
    ordTypeName: string,
    timeInForce: string,
    timeInForceName: string,
    missingFieldsList: Array<number>,
  }
}

export class DecodeEnumInput extends jspb.Message {
  getTag(): number;
  setTag(value: number): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DecodeEnumInput.AsObject;
  static toObject(includeInstance: boolean, msg: DecodeEnumInput): DecodeEnumInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DecodeEnumInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DecodeEnumInput;
  static deserializeBinaryFromReader(message: DecodeEnumInput, reader: jspb.BinaryReader): DecodeEnumInput;
}

export namespace DecodeEnumInput {
  export type AsObject = {
    tag: number,
    value: string,
  }
}

export class EnumDecodeOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getFound(): boolean;
  setFound(value: boolean): void;

  getMeaning(): string;
  setMeaning(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnumDecodeOutput.AsObject;
  static toObject(includeInstance: boolean, msg: EnumDecodeOutput): EnumDecodeOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnumDecodeOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnumDecodeOutput;
  static deserializeBinaryFromReader(message: EnumDecodeOutput, reader: jspb.BinaryReader): EnumDecodeOutput;
}

export namespace EnumDecodeOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    found: boolean,
    meaning: string,
  }
}

export class ValidationOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getValid(): boolean;
  setValid(value: boolean): void;

  getDeclaredBodyLength(): number;
  setDeclaredBodyLength(value: number): void;

  getActualBodyLength(): number;
  setActualBodyLength(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidationOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ValidationOutput): ValidationOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidationOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidationOutput;
  static deserializeBinaryFromReader(message: ValidationOutput, reader: jspb.BinaryReader): ValidationOutput;
}

export namespace ValidationOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    valid: boolean,
    declaredBodyLength: number,
    actualBodyLength: number,
  }
}

export class CheckSumValidationOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getValid(): boolean;
  setValid(value: boolean): void;

  getDeclaredChecksum(): string;
  setDeclaredChecksum(value: string): void;

  getComputedChecksum(): string;
  setComputedChecksum(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckSumValidationOutput.AsObject;
  static toObject(includeInstance: boolean, msg: CheckSumValidationOutput): CheckSumValidationOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckSumValidationOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckSumValidationOutput;
  static deserializeBinaryFromReader(message: CheckSumValidationOutput, reader: jspb.BinaryReader): CheckSumValidationOutput;
}

export namespace CheckSumValidationOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    valid: boolean,
    declaredChecksum: string,
    computedChecksum: string,
  }
}

export class ComputeCheckSumInput extends jspb.Message {
  getRaw(): string;
  setRaw(value: string): void;

  getDelimiter(): string;
  setDelimiter(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ComputeCheckSumInput.AsObject;
  static toObject(includeInstance: boolean, msg: ComputeCheckSumInput): ComputeCheckSumInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ComputeCheckSumInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ComputeCheckSumInput;
  static deserializeBinaryFromReader(message: ComputeCheckSumInput, reader: jspb.BinaryReader): ComputeCheckSumInput;
}

export namespace ComputeCheckSumInput {
  export type AsObject = {
    raw: string,
    delimiter: string,
  }
}

export class ComputeCheckSumOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getChecksum(): string;
  setChecksum(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ComputeCheckSumOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ComputeCheckSumOutput): ComputeCheckSumOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ComputeCheckSumOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ComputeCheckSumOutput;
  static deserializeBinaryFromReader(message: ComputeCheckSumOutput, reader: jspb.BinaryReader): ComputeCheckSumOutput;
}

export namespace ComputeCheckSumOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    checksum: string,
  }
}

export class SplitLogInput extends jspb.Message {
  getRaw(): string;
  setRaw(value: string): void;

  getDelimiter(): string;
  setDelimiter(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SplitLogInput.AsObject;
  static toObject(includeInstance: boolean, msg: SplitLogInput): SplitLogInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SplitLogInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SplitLogInput;
  static deserializeBinaryFromReader(message: SplitLogInput, reader: jspb.BinaryReader): SplitLogInput;
}

export namespace SplitLogInput {
  export type AsObject = {
    raw: string,
    delimiter: string,
  }
}

export class SplitLogOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearMessagesList(): void;
  getMessagesList(): Array<string>;
  setMessagesList(value: Array<string>): void;
  addMessages(value: string, index?: number): string;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SplitLogOutput.AsObject;
  static toObject(includeInstance: boolean, msg: SplitLogOutput): SplitLogOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SplitLogOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SplitLogOutput;
  static deserializeBinaryFromReader(message: SplitLogOutput, reader: jspb.BinaryReader): SplitLogOutput;
}

export namespace SplitLogOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    messagesList: Array<string>,
    count: number,
  }
}

export class ExtractGroupInput extends jspb.Message {
  getRaw(): string;
  setRaw(value: string): void;

  getDelimiter(): string;
  setDelimiter(value: string): void;

  getCountTag(): number;
  setCountTag(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractGroupInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractGroupInput): ExtractGroupInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractGroupInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractGroupInput;
  static deserializeBinaryFromReader(message: ExtractGroupInput, reader: jspb.BinaryReader): ExtractGroupInput;
}

export namespace ExtractGroupInput {
  export type AsObject = {
    raw: string,
    delimiter: string,
    countTag: number,
  }
}

export class FixFieldGroup extends jspb.Message {
  clearFieldsList(): void;
  getFieldsList(): Array<FixField>;
  setFieldsList(value: Array<FixField>): void;
  addFields(value?: FixField, index?: number): FixField;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FixFieldGroup.AsObject;
  static toObject(includeInstance: boolean, msg: FixFieldGroup): FixFieldGroup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FixFieldGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FixFieldGroup;
  static deserializeBinaryFromReader(message: FixFieldGroup, reader: jspb.BinaryReader): FixFieldGroup;
}

export namespace FixFieldGroup {
  export type AsObject = {
    fieldsList: Array<FixField.AsObject>,
  }
}

export class RepeatingGroupOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getFound(): boolean;
  setFound(value: boolean): void;

  getDeclaredCount(): number;
  setDeclaredCount(value: number): void;

  clearEntriesList(): void;
  getEntriesList(): Array<FixFieldGroup>;
  setEntriesList(value: Array<FixFieldGroup>): void;
  addEntries(value?: FixFieldGroup, index?: number): FixFieldGroup;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RepeatingGroupOutput.AsObject;
  static toObject(includeInstance: boolean, msg: RepeatingGroupOutput): RepeatingGroupOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RepeatingGroupOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RepeatingGroupOutput;
  static deserializeBinaryFromReader(message: RepeatingGroupOutput, reader: jspb.BinaryReader): RepeatingGroupOutput;
}

export namespace RepeatingGroupOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    found: boolean,
    declaredCount: number,
    entriesList: Array<FixFieldGroup.AsObject>,
  }
}

export class FixVersionOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getFound(): boolean;
  setFound(value: boolean): void;

  getBeginString(): string;
  setBeginString(value: string): void;

  getMajor(): number;
  setMajor(value: number): void;

  getMinor(): number;
  setMinor(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FixVersionOutput.AsObject;
  static toObject(includeInstance: boolean, msg: FixVersionOutput): FixVersionOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FixVersionOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FixVersionOutput;
  static deserializeBinaryFromReader(message: FixVersionOutput, reader: jspb.BinaryReader): FixVersionOutput;
}

export namespace FixVersionOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    found: boolean,
    beginString: string,
    major: number,
    minor: number,
  }
}

export class TagListOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  clearTagsList(): void;
  getTagsList(): Array<number>;
  setTagsList(value: Array<number>): void;
  addTags(value: number, index?: number): number;

  getUniqueCount(): number;
  setUniqueCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TagListOutput.AsObject;
  static toObject(includeInstance: boolean, msg: TagListOutput): TagListOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TagListOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TagListOutput;
  static deserializeBinaryFromReader(message: TagListOutput, reader: jspb.BinaryReader): TagListOutput;
}

export namespace TagListOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    tagsList: Array<number>,
    uniqueCount: number,
  }
}

export class FieldCountOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getTotalFields(): number;
  setTotalFields(value: number): void;

  getUniqueTags(): number;
  setUniqueTags(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FieldCountOutput.AsObject;
  static toObject(includeInstance: boolean, msg: FieldCountOutput): FieldCountOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FieldCountOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FieldCountOutput;
  static deserializeBinaryFromReader(message: FieldCountOutput, reader: jspb.BinaryReader): FieldCountOutput;
}

export namespace FieldCountOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    totalFields: number,
    uniqueTags: number,
  }
}

export class ClassifyOutput extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  getMsgType(): string;
  setMsgType(value: string): void;

  getMsgTypeName(): string;
  setMsgTypeName(value: string): void;

  getCategory(): string;
  setCategory(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClassifyOutput.AsObject;
  static toObject(includeInstance: boolean, msg: ClassifyOutput): ClassifyOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClassifyOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClassifyOutput;
  static deserializeBinaryFromReader(message: ClassifyOutput, reader: jspb.BinaryReader): ClassifyOutput;
}

export namespace ClassifyOutput {
  export type AsObject = {
    ok: boolean,
    error: string,
    msgType: string,
    msgTypeName: string,
    category: string,
  }
}

