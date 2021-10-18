import time
import difflib
start_time = time.time()
words = ['halo', 'helo', 'hllo', 'alo', 'hallo', 'helloa', 'hilo']
ans = difflib.get_close_matches('hello', words)
print(ans)
dct = {}
sentences = ["My name is sing song", "I am a mother"," I am happy","You sing like my mother"]
search_keywords=['moher','sing','song']

for sentence in sentences:
    dct[sentence] = sum(1 for word in search_keywords if word in sentence)


best_sentences = [key for key,value in dct.items() if value == max(dct.values())]
print("\n".join(best_sentences))
print("Process finished --- %s seconds ---" % (time.time() - start_time))