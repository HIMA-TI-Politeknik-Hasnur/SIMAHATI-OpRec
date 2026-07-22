<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function publik()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function index()
    {
        $settings = Setting::all();
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function show($key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        return response()->json([
            'success' => true,
            'data' => $setting
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:settings,key',
            'value' => 'nullable|string',
            'type' => 'in:string,boolean,file'
        ]);

        $setting = Setting::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Setting berhasil dibuat.',
            'data' => $setting
        ], 201);
    }

    public function update(Request $request, $key)
    {
        $validated = $request->validate([
            'value' => 'nullable|string',
            'type' => 'in:string,boolean,file'
        ]);

        $setting = Setting::firstOrCreate(['key' => $key]);
        $setting->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Setting berhasil diupdate.',
            'data' => $setting
        ]);
    }

    public function destroy($key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();
        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Setting berhasil dihapus.'
        ]);
    }
}
