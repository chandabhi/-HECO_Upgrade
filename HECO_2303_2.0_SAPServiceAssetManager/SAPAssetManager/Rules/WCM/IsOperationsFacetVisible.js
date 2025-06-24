import CommonLibrary from '../Common/Library/CommonLibrary';

export default function IsOperationsFacetVisible(context) {
    return CommonLibrary.getWorkOrderAssnTypeLevel(context) === 'Operation';
}
