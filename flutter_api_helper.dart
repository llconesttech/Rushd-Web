// Flutter API Helper for Rushd App
// Add this to your Flutter project for API authentication

import 'package:crypto/crypto.dart';
import 'dart:convert';

class RushdApiHelper {
  // For Mobile: Use this header
  static const String apiKey = 'your-mobile-api-key';
  
  // Base URL
  static const String baseUrl = 'http://localhost:3000/api/v1';
  
  // For Web: Generate HMAC token
  static String generateWebToken() {
    final timestamp = (DateTime.now().millisecondsSinceEpoch / 1000).floor();
    final secret = 'rushd-app-secret-change-this-in-production';
    final key = utf8.encode(secret);
    final message = utf8.encode(timestamp.toString());
    final hmacSha256 = Hmac(sha256, key);
    final digest = hmacSha256.convert(message);
    return digest.toString();
  }
  
  // Get headers for mobile request
  static Map<String, String> getMobileHeaders() {
    return {
      'x-api-key': apiKey,
    };
  }
  
  // Get headers for web request
  static Map<String, String> getWebHeaders() {
    final timestamp = (DateTime.now().millisecondsSinceEpoch / 1000).floor();
    return {
      'x-app-ts': timestamp.toString(),
      'x-app-token': generateWebToken(),
    };
  }
}

// API Endpoints
class RushdApi {
  static const String baseUrl = 'http://localhost:3000/api/v1';
  
  // Quran
  static const String quranMeta = '$baseUrl/quran/meta';
  static const String quranSurah = '$baseUrl/quran/surah'; // ?edition=&type=
  static const String quranPage = '$baseUrl/quran/page'; // /:script/:page
  static const String quranTafsirMeta = '$baseUrl/quran/tafsir-meta';
  static const String quranShanNuzool = '$baseUrl/quran/shan-e-nuzool'; // /:edition/:surah
  static const String quranSearch = '$baseUrl/quran/search'; // ?q=&edition=&limit=
  
  // Hadith
  static const String hadithEditions = '$baseUrl/hadith/editions';
  static const String hadithInfo = '$baseUrl/hadith/info';
  static const String hadithNarrators = '$baseUrl/hadith/narrators';
  static const String hadithNarratorClusters = '$baseUrl/hadith/narrator-clusters';
  static const String hadithBook = '$baseUrl/hadith'; // /:bookId/:lang
  
  // Hadith Q&A
  static const String qaCategories = '$baseUrl/qa/categories';
  static const String qaCategory = '$baseUrl/qa/category'; // /:category
  static const String qaSubcategory = '$baseUrl/qa/subcategory'; // /:category/:subcategory
  static const String qaItem = '$baseUrl/qa/item'; // /:id
  static const String qaSearch = '$baseUrl/qa/search'; // ?q=&page=&limit=
  static const String qaTopics = '$baseUrl/qa/topics';
  static const String qaMacroIndex = '$baseUrl/qa/macro-index';
  
  // Asmaul Husna (99 Names of Allah)
  static const String asmauHusna = '$baseUrl/asmaul-husna';
  // Get by ID: $baseUrl/asmaul-husna/:id
  
  // Audio (public)
  static const String audio = '$baseUrl/audio'; // /:reciter/:filename
  
  // Assets (public)
  static const String assets = '$baseUrl/assets'; // /fonts/Tuluth/Vector-*.svg
}

// Example Dio Interceptor
/*
import 'package:dio/dio.dart';

class RushdAuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // Add mobile API key header
    options.headers['x-api-key'] = RushdApiHelper.apiKey;
    handler.next(options);
  }
}

// Usage with Dio
final dio = Dio(BaseOptions(
  baseUrl: 'http://localhost:3000/api/v1',
));
dio.interceptors.add(RushdAuthInterceptor());

// Example API calls:
// Quran
// final response = await dio.get('/quran/surah/1?edition=en-sahih');
// final response = await dio.get('/quran/page/quran-uthmani/1');
// final response = await dio.get('/quran/search?q=Allah&limit=10');

// Hadith
// final response = await dio.get('/hadith/editions');
// final response = await dio.get('/hadith/bukhari/eng');

// Hadith Q&A
// final response = await dio.get('/qa/categories');
// final response = await dio.get('/qa/search?q=prayer&limit=20');

// Asmaul Husna (99 Names)
// final response = await dio.get('/asmaul-husna');
// final response = await dio.get('/asmaul-husna/1');
*/
