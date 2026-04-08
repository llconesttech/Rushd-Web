import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';

class RushdMobileAuth {
  static const String baseUrl = 'http://localhost:3000';
  
  static String? _mobileApiKey;
  static String? _jwtToken;
  static DateTime? _tokenExpiry;

  static void setMobileApiKey(String key) {
    _mobileApiKey = key;
  }

  static Future<String> authenticate() async {
    if (_jwtToken != null && _tokenExpiry != null && DateTime.now().isBefore(_tokenExpiry!)) {
      return _jwtToken!;
    }

    if (_mobileApiKey == null) {
      throw Exception('Mobile API key not set. Call setMobileApiKey first.');
    }

    final timestamp = (DateTime.now().millisecondsSinceEpoch / 1000).floor();
    final secret = _mobileApiKey!;
    final key = utf8.encode(secret);
    final message = utf8.encode(timestamp.toString());
    final hmacSha256 = Hmac(sha256, key);
    final digest = hmacSha256.convert(message);
    final token = digest.toString();

    try {
      final response = await fetch(
        '$baseUrl/api/v1/mobile/auth',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': _mobileApiKey!,
          'X-App-Ts': timestamp.toString(),
          'X-App-Token': token,
        },
      );

      if (response.ok) {
        final data = await response.json();
        _jwtToken = data['token'];
        final expiresIn = data['expiresIn'] ?? 3600;
        _tokenExpiry = DateTime.now().add(Duration(seconds: expiresIn));
        return _jwtToken!;
      }
      
      throw Exception('Authentication failed: ${response.status}');
    } catch (e) {
      throw Exception('Failed to authenticate: $e');
    }
  }

  static Map<String, String> getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $_jwtToken',
    };
  }

  static void clearToken() {
    _jwtToken = null;
    _tokenExpiry = null;
  }
}

class RushdApi {
  static const String baseUrl = 'http://localhost:3000/api/v1';

  static const String quranMeta = '$baseUrl/quran/meta';
  static const String quranSurah = '$baseUrl/quran/surah';
  static const String quranPage = '$baseUrl/quran/page';
  static const String quranTafsirMeta = '$baseUrl/quran/tafsir-meta';
  static const String quranShanNuzool = '$baseUrl/quran/shan-e-nuzool';
  static const String quranSearch = '$baseUrl/quran/search';
  
  static const String hadithEditions = '$baseUrl/hadith/editions';
  static const String hadithInfo = '$baseUrl/hadith/info';
  static const String hadithNarrators = '$baseUrl/hadith/narrators';
  static const String hadithBook = '$baseUrl/hadith';
  
  static const String qaCategories = '$baseUrl/qa/categories';
  static const String qaCategory = '$baseUrl/qa/category';
  static const String qaSearch = '$baseUrl/qa/search';
  
  static const String asmauHusna = '$baseUrl/asmaul-husna';
  
  static const String audio = '$baseUrl/audio';
  static const String assets = '$baseUrl/assets';
}

class RushdApiEndpoints {
  static String surah(int number, {String? edition, String? type}) {
    var url = '${RushdApi.quranSurah}/$number';
    final params = <String>[];
    if (edition != null) params.add('edition=$edition');
    if (type != null) params.add('type=$type');
    if (params.isNotEmpty) url += '?${params.join('&')}';
    return url;
  }

  static String page(String script, int pageNum) {
    return '${RushdApi.quranPage}/$script/$pageNum';
  }

  static String search(String query, {String? edition, int? limit}) {
    var url = '${RushdApi.quranSearch}?q=${Uri.encodeComponent(query)}';
    if (edition != null) url += '&edition=$edition';
    if (limit != null) url += '&limit=$limit';
    return url;
  }

  static String hadithBook(String bookId, String lang) {
    return '${RushdApi.hadithBook}/$bookId/$lang';
  }

  static String qaItem(int id) {
    return '${RushdApi.baseUrl}/qa/item/$id';
  }

  static String asmauHusnaById(int id) {
    return '${RushdApi.asmauHusna}/$id';
  }
}