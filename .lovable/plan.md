

# Fix: MainActivity.java Patching Error

## Problem
Build fail ho raha hai kyunki `setup-android.sh` script `MainActivity.java` ko galat tarike se patch kar raha hai. Capacitor ka generated `MainActivity.java` ek single line hai:
```java
public class MainActivity extends BridgeActivity {}
```

Script `onCreate` method ko class ke **bahar** insert kar raha hai, isliye Java "unnamed class" error de raha hai.

## Solution
`sed` command ko fix karna hai taaki `{}` ko replace karke method class ke **andar** insert ho.

## Technical Details

**File**: `scripts/setup-android.sh` (lines 66-72)

**Current (broken)**:
```bash
sed -i '/public class MainActivity extends BridgeActivity/a \
    @Override\
    public void onCreate(android.os.Bundle savedInstanceState) {\
        registerPlugin(SilentModePlugin.class);\
        super.onCreate(savedInstanceState);\
    }' "$MAIN_ACTIVITY_FILE"
```

**Fixed**:
```bash
# Replace the single-line class with a full class body containing onCreate
sed -i 's/public class MainActivity extends BridgeActivity {}/public class MainActivity extends BridgeActivity {\
    @Override\
    public void onCreate(android.os.Bundle savedInstanceState) {\
        registerPlugin(SilentModePlugin.class);\
        super.onCreate(savedInstanceState);\
    }\
}/' "$MAIN_ACTIVITY_FILE"
```

This replaces `{}` with a proper class body containing the `onCreate` method inside the braces.

Sirf ek sed command change - baaki sab same rahega.

