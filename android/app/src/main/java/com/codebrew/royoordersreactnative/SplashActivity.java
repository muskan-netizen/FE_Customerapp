package com.codebrew;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        openMainActivity(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        openMainActivity(intent);
    }

    private void openMainActivity(Intent sourceIntent) {
        try {
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        // Preserve notification and deep-link payloads while forwarding through splash.
        if (sourceIntent != null) {
            if (sourceIntent.getAction() != null) {
                intent.setAction(sourceIntent.getAction());
            }

            if (sourceIntent.getData() != null || sourceIntent.getType() != null) {
                intent.setDataAndType(sourceIntent.getData(), sourceIntent.getType());
            }

            if (sourceIntent.getCategories() != null) {
                for (String category : sourceIntent.getCategories()) {
                    intent.addCategory(category);
                }
            }

            Bundle extras = sourceIntent.getExtras();
            if (extras != null) {
                intent.putExtras(extras);
            }
        }

        startActivity(intent);
        finish();
        }
        catch(Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
