
import { getCurrentFontScale } from '@nativescript/core/accessibility';

// font scale range: https://github.com/NativeScript/NativeScript/blob/main/packages/core/accessibility/font-scale-common.ts
export default function ProgressTrackerHeight() {
    if (getCurrentFontScale() >= 1.3) { 
        return 160;
    }
    return 128;
}
