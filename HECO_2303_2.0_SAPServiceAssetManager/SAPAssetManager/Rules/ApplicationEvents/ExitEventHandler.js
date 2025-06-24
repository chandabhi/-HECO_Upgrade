
import resetPeriodicAutoSync from './ResetPeriodicAutoSync';

export default function ExitEventHandler(context) {
    resetPeriodicAutoSync(context);
    // kill process after exiting
    if (context.nativescript.platformModule.isAndroid) {
        // eslint-disable-next-line no-undef
        android.os.Process.killProcess(android.os.Process.myPid());
    }
}
