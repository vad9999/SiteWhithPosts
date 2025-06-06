import { onMounted, onBeforeUnmount } from 'vue';

export function useIntersectionObserver(elRef, callback, options = { rootMargin: '0px', threshold: 1.0 }) {
  let observer = null;

  onMounted(() => {
  const el = elRef.value
  if (!el) return

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback()
      }
    })
  }, options)

  observer.observe(el)
})

  onBeforeUnmount(() => {
    if (observer && elRef.value) {
      observer.unobserve(elRef.value);
      observer.disconnect();
    }
  });
}