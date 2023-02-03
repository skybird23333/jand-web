<template>
    <Card class="preset">
        
        <template #header>
            <span class="material-icons">
                {{ icon }}
            </span>
            {{ title }}
        </template>
        {{ description }}

    </Card>
</template>

<script>
import Card from '../Common/Card.vue';

export default {
    components: { Card },
    props: {
        title: String,
        description: String,
        icon: String,
    }
}
</script>

<style scoped>
.preset {
  transition: border-color 0.2s, background-color 0.2s;
  filter: drop-shadow(1px 1px 8px black);
}

.preset:hover {
  background-color: var(--background-tertiary);
  border-color: var(--foreground-primary);
  filter: drop-shadow(3px 3px 8px black);
  cursor: pointer;
}

</style>